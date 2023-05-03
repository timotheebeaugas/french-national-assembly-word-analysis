import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";

/**
 * Interfaces
 */
interface LogsDetails {
  inReport: number;
  inDatabase: number;
}

interface Logs {
  id: (string | number)[];
  proportion: number | null;
  count: { [key: string]: Partial<LogsDetails> };
}

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  /**
   * @const data - save report data for easier access inside methods
   * @const reportId - local variable to save current report id
   * @const logs - variable created for save entries logs during reading process
   */
  protected reportId: null | number = null;
  readonly logs: Logs = {
    id: [],
    proportion: null,
    count: { report: {}, agendaItems: {}, actors: {}, speeches: {} },
  };

  /**
   * Create a parser.
   * @constructor
   * @param data - incoming parsed raw datas.
   */
  constructor(readonly data: any) {
    this.data = data.compteRendu;
  }

  /**
   * Check if current report exist in database.
   * @return {Promise<void>} report's id.
   */
  async readMetadata(): Promise<void> {
    try {
      const reportRepository = AppDataSource.getRepository(Report);
      const findReports = await reportRepository.findOneBy({
        externalId: this.data.uid,
      });

      if (findReports == null) {
        this.reportId = await this.createReport();
      } else {
        this.reportId = findReports.id;
      }

    } catch (error) {
      throw new Error(`Can't save Report ${this.data.uid} in database`);
    }
  }

  /**
   * Create a new report in database.
   * @return {Promise<number>} report's id.
   */
  async createReport(): Promise<number> {
    let fixedPresidency: string | null = null;
    if (typeof this.data.metadonnees.sommaire.presidentSeance === "object") {
      fixedPresidency = this.data.metadonnees.sommaire.presidentSeance["#text"];
    }
    const report = new Report();
    report.sourceURL = `https://www.assemblee-nationale.fr/dyn/opendata/${this.data.uid}.xml`;
    report.externalId = this.data.uid;
    report.legislature = this.data.metadonnees.legislature;
    report.date = this.data.metadonnees.dateSeanceJour;
    report.daySessionNumber = this.data.metadonnees.numSeanceJour;
    report.presidency = fixedPresidency
      ? fixedPresidency
      : this.data.metadonnees.sommaire.presidentSeance;
    await AppDataSource.manager.save(report);
    return report.id;
  }

  /**
   * Read summaray and check if alerady exist.
   * @return {Promise<void>} Return nothing. Throw an error if one summary object has no 'titreStruct'.
   */
  async readSummary(): Promise<void> {
    let summary = this.data.metadonnees.sommaire;
    let i: number = 1;
    while (summary[`sommaire${i}`]) {
      let currentObj = summary[`sommaire${i}`];
      try {
        if (currentObj.hasOwnProperty("titreStruct")) {
          this.summaryWrapper(currentObj);
        } else if (typeof currentObj === "object") {
          Object.keys(currentObj).forEach((element) => {
            this.summaryWrapper(currentObj[element]);
          });
        }
      } catch (error) {
        throw new Error(`Error in summary on position ${i}`);
      }
      i++;
    }
  }

  /**
   * Call two methods: createAgendaItems() and searchParagraphs()
   * If there is a summary items nested inside another, this method call herself on each one
   * @param {any} currentObj - The object to be processed
   * @return {void} return nothing.
   */

  async summaryWrapper(currentObj: any): Promise<void> {
    Object.keys(currentObj).forEach((element) => {
      if (element.match("sommaire")) {
        this.summaryWrapper(currentObj[element]), delete currentObj[element];
      }
    });
    if (currentObj.titreStruct) {
      let agendaItemId = await this.createAgendaItems(currentObj.titreStruct);
      if (currentObj.hasOwnProperty("para")) {
        Object.values(currentObj.para).forEach(async (element: object) => {
          this.searchParagraphs(
            this.data.contenu,
            element["@_id_syceron" as keyof object],
            agendaItemId
          );
        });
      }
    }
  }

  /**
   * Create a new agenda item in database.
   * @param {any} title - Object title with one title and his id
   * @return {Promise<number>} item's id.
   */
  async createAgendaItems(title: any): Promise<number> {
    let fixedTitle: string = "";
    if (typeof title.intitule === "object") {
      Object.keys(title.intitule).forEach((element) => {
        fixedTitle = fixedTitle.concat(" ", title.intitule[element]);
      });
    }

    const agendaRepository = AppDataSource.getRepository(AgendaItem);
    const findAgendas = await agendaRepository.findOneBy({
      externalId: title["@_id_syceron"],
    });
    if (findAgendas == null) {
      const item = new AgendaItem();
      item.externalId = title["@_id_syceron"];
      item.report = this.reportId;
      item.title = fixedTitle.trim() || title.intitule;
      await AppDataSource.manager.save(item);
      return item.id;
    } else {
      return findAgendas.id;
    }
  }

  /**
   * Iterate paragraphs array from summary and found each paragraph in report's content by '@_id_syceron'
   * @param {object} contentObject - ONbject that needs to be checked and/or destructured
   * @param {string} paragraphId - The 'paragraphId' string refer to the wanted paragraph in the report
   * @param {number} agendaItemId - The 'agendaItemId' number refer to the current Agenda Item id in our database
   * @return {void} return nothing.
   */

  searchParagraphs(
    contentObject: object,
    paragraphId: string,
    agendaItemId: number
  ): void {
    try {
      for (const key in contentObject) {
        let obj: any | never =
          contentObject[key as keyof object]["@_id_syceron"];
        if (obj && obj != undefined) {
          if (obj.match(paragraphId)) {
            this.readParagraph(
              contentObject[key as keyof object],
              agendaItemId
            );
          }
        }
        if (typeof contentObject[key as keyof object] === "object") {
          this.searchParagraphs(
            contentObject[key as keyof object],
            paragraphId,
            agendaItemId
          );
        }
      }
    } catch (error) {
      throw new Error(`Paragraph ${paragraphId} not found in content`);
    }
  }

  /**
   * Read one paragraph and check if is it necessary to create a new actor and a new speech in database.
   * @param {any} paragraph - One 'paragraph' object that content text and actor data
   * @param {number} agendaItemId - The 'agendaItemId' number refer to the current Agenda Item id in our database
   * @return {Promise<void>} return nothing.
   */
  async readParagraph(paragraph: any, agendaItemId: number): Promise<void> {
    if (paragraph["orateurs"]) {
      const actorRepository = AppDataSource.getRepository(Actor);
      const findActors = await actorRepository.findOneBy({
        externalId: paragraph["orateurs"]["orateur"]["id"],
      });

      let actorId: number = null;

      if (findActors == null) {
        actorId = await this.createActor(paragraph);
      } else {
        actorId = findActors.id;
      }

      const speechRepository = AppDataSource.getRepository(Speech);
      const findSpeeches = await speechRepository.findOneBy({
        externalId: paragraph["@_id_syceron"],
      });

      if (findSpeeches == null) {
        await this.createSpeeches(paragraph, agendaItemId, actorId);
      }
    }
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content actor name and id
   * @return {Promise<number>} return actor's id.
   */
  async createActor(paragraph: any): Promise<number> {
    const actor = new Actor();
    (actor.externalId = paragraph["orateurs"]["orateur"]["id"]),
      (actor.name = paragraph.orateurs.orateur.nom);
    await AppDataSource.manager.save(actor);
    return actor.id;
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content text and actor's data
   * @param {number} agendaItemId - The 'agendaItemId' number refer to the current Agenda Item id in our database
   * @param {number} actorId - The 'actorId' number refer to the speaker id in our database
   * @return {Promise<void>} return nothing.
   */
  async createSpeeches(
    paragraph: any,
    agendaItemId: number,
    actorId: number
  ): Promise<void> {
    const speech = new Speech();
    speech.externalId = paragraph["@_id_syceron"];
    speech.report = this.reportId;
    speech.agendaItem = agendaItemId;
    speech.actor = actorId;
    speech.content = paragraph["texte"]["#text"];
    await AppDataSource.manager.save(speech);
  }

  /**
   * Test the document with Regex before reading to identify all the data to be recorded.
   */
  dataAnalysis(): void {
    this.logs.id = [this.data.uid];

    try {
      const regexAgendaItem = /"titreStruct":/gi;
      const regexActor = /"orateur":/gi;
      const regexSpeech = /"texte":/gi;
      const metadataString: string = JSON.stringify(this.data.metadonnees.sommaire);
      const dataString: string = JSON.stringify(this.data.contenu);
      const found: number = dataString.match(regexSpeech).length;
      const found2: number = metadataString.match(regexAgendaItem).length;
      
      this.logs.count.report.inDatabase = 1;
      console.log(found2)
/*       for(const prop in this.logs.count){
        // this.logs.count[prop].inReport
        console.log(found)
      } */
    } catch (error) {
      throw new Error(`Can't test this Report`);
    }
  }

  /**
   * Main method for trigger the other methods.
   * @return {Promise<void>} returns nothing.
   */
  async Read(): Promise<void> {
    try {
      await AppDataSource.initialize();

      await this.readMetadata();

      await this.readSummary();

      this.dataAnalysis();

      return;
    } catch (error) {
      return error;
    }
  }
}

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
  externalId: string | null;
  recordingRate: `${number}%` | null;
  count: { [key: string]: Partial<LogsDetails> };
}

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  /**
   * @const dataString - Unparsed data in string format for analysis in parallel to reading
   * @const data - save report data for easier access inside methods
   * @const reportId - local variable to save current report id
   * @const logs - variable created for save entries logs during reading process
   */
  protected reportId: null | number = null;
  private logs: Logs = {
    externalId: null,
    recordingRate: null,
    count: { report: {}, agendaItems: {}, actors: {}, speeches: {} },
  };

  /**
   * Create a parser.
   * @constructor
   * @param dataString - incoming unparsed datas.
   * @param data - incoming parsed datas.
   */
  constructor(readonly dataString: string, readonly data: any) {
    this.dataString = dataString;
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
      
      if (this.reportId) this.increaseLogsCounter("report");
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
   * @param {any} obj - The object to be processed (initialized with the summary)
   * @return {Promise<void>} Return nothing. Throw an error if one summary object has no 'titreStruct'.
   */
  async readSummary(obj: any): Promise<void> {
    try {
      if (obj) {
        if (typeof obj === "object") {
          Object.keys(obj).forEach((el) => {
            if (el.match("presidentSeance")) {
              delete obj[el];
            }
            if (el.match("titreStruct")) {
              this.summaryWrapper(obj[el]);
              delete obj[el];
              this.readSummary(obj[el]);
            } else {
              this.readSummary(obj[el]);
            } 
          });
        } else {
          if (obj.hasOwnProperty("titreStruct")) {
            this.summaryWrapper(obj);
          }
        }
      }
    } catch (error) {
      throw new Error(`Error in summary:${error}`);
    }
  }

  /**
   * Call two methods: createAgendaItems() and searchParagraphs()
   * If there is a summary items nested inside another, this method call herself on each one
   * @param {any} obj - The object to be processed
   * @return {void} return nothing.
   */

  async summaryWrapper(obj: any): Promise<void> {
    try {
      let agendaItemId = await this.createAgendaItems(obj);
      if (obj.hasOwnProperty("para")) {
        Object.values(obj.para).forEach(async (element: object) => {
          this.searchParagraphs(
            this.data.contenu,
            element["@_id_syceron" as keyof object],
            agendaItemId
          );
        });
      }
    } catch (error) {
      throw new Error(`Can't read this object? ${error}`);
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

    let itemId: number | null = null;

    if (findAgendas == null) {
      const item = new AgendaItem();
      item.externalId = title["@_id_syceron"];
      item.report = this.reportId;
      item.title = fixedTitle.trim() || title.intitule;
      await AppDataSource.manager.save(item);
      
      itemId = item.id;
    } else {
      
      itemId = findAgendas.id;
    }
    await this.increaseLogsCounter("agendaItems");
    return itemId
  }

  /**
   * Iterate paragraphs array from summary and found each paragraph in report's content by '@_id_syceron'
   * @param {object} contentObject - ONbject that needs to be checked and/or destructured
   * @param {string} paragraphId - The 'paragraphId' string refer to the wanted paragraph in the report
   * @param {number} agendaItemId - The 'agendaItemId' number refer to the current Agenda Item id in our database
   * @return {Promise<void>} return nothing.
   */

  async searchParagraphs(
    contentObject: object,
    paragraphId: string,
    agendaItemId: number
  ): Promise<void> {
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

      let actorId: number | null = null;

      if (findActors == null) {
        actorId = await this.createActor(paragraph);
      } else {
        actorId = findActors.id;
      }
      if (actorId)await this.increaseLogsCounter("actors");

      const speechRepository = AppDataSource.getRepository(Speech);
      const findSpeeches = await speechRepository.findOneBy({
        externalId: paragraph["@_id_syceron"],
      });
      let speechId: number | null = null;

      if (findSpeeches == null) {
        speechId = await this.createSpeeches(paragraph, agendaItemId, actorId);
      } else {
        speechId = findSpeeches.id;
      }

      if (speechId) await this.increaseLogsCounter("speeches");
    }
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content actor name and id
   * @return {Promise<number>} return actor id.
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
   * @return {Promise<number>} return speech id.
   */
  async createSpeeches(
    paragraph: any,
    agendaItemId: number,
    actorId: number
  ): Promise<number> {
    const speech = new Speech();
    speech.externalId = paragraph["@_id_syceron"];
    speech.report = this.reportId;
    speech.agendaItem = agendaItemId;
    speech.actor = actorId;
    speech.content = paragraph["texte"]["#text"];
    await AppDataSource.manager.save(speech);
    return speech.id;
  }

  /**
   * Update logs object during reading process
   * @param {string} prop - target object property
   * @return {Promise<void>} return nothing.
   */
  async increaseLogsCounter(prop: string): Promise<void> {
    try {
      this.logs.count[prop].inDatabase
        ? this.logs.count[prop].inDatabase++
        : (this.logs.count[prop].inDatabase = 1);
    } catch (error) {
      throw new Error(`Can't update object logs`);
    }
  }

  /**
   * Test unparsed data with regex for compare the result with the work done by the reading methods.
   */
  async testReport(): Promise<void> {
    try {
      this.logs.externalId = this.data.uid;
      const regex: RegExp[] = [
        /<uid>/gi,
        /<\/titreStruct>/gi,
        /<orateur>/gi,
        /<texte stime=/gi,
      ];
      let i = 0;

      for (const prop in this.logs.count) {
        const found = this.dataString.match(regex[i]);
        this.logs.count[prop].inReport = found.length;
        i++;
      }

      let totalInReport = 0;
      let totalInDatabase = 0;

      for (const prop in this.logs.count) {
        totalInReport = totalInReport + this.logs.count[prop].inReport;
        totalInDatabase = totalInDatabase + this.logs.count[prop].inDatabase;
      }

      this.logs.recordingRate = `${Math.trunc(
        (totalInDatabase / totalInReport) * 100
      )}%`;

      console.log(this.logs);
    } catch (error) {
      throw new Error(`Can't test this Report`);
    }
  }

  /**
   * Main method for trigger the other methods.
   * @return {Promise<void>} returns completed logs object.
   */
  async Read(): Promise<void> {
    try {
      await AppDataSource.initialize();

      await this.readMetadata();

      await this.readSummary(this.data.metadonnees.sommaire);

      return;
    } catch (error) {
      return error;
    }
  }
}

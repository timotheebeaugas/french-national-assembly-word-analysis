import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  /**
   * @const data - save report data for easier access inside methods
   * @const reportId - local variable to save current report id
   * @const agendaItemId - local variable to save current agendaItem id
   */
  protected reportId: null | number = null;
  protected agendaItemId: null | number = null;

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
    const reportRepository = AppDataSource.getRepository(Report);
    const findReports = await reportRepository.findOneBy({
      externalId: this.data.uid,
    });

    if (findReports == null) {
      this.reportId = await this.createReport();
    } else {
      this.reportId = findReports.id;
    }
  }

  /**
   * Create a new report in database.
   * @return {Promise<number>} report's id.
   */
  async createReport(): Promise<number> {
    const report = new Report();
    report.sourceURL = `https://www.assemblee-nationale.fr/dyn/opendata/${this.data.uid}.xml`;
    report.externalId = this.data.uid;
    report.legislature = this.data.metadonnees.legislature;
    report.date = this.data.metadonnees.dateSeanceJour;
    report.daySessionNumber = this.data.metadonnees.numSeanceJour;
    report.presidency = this.data.metadonnees.sommaire.presidentSeance;
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
        this.summaryWrapper(currentObj[element]),
          delete currentObj[element];
      }
    });
    let agendaItemId = await this.createAgendaItems(currentObj.titreStruct);
    if (currentObj.hasOwnProperty("para")) {
      Object.values(currentObj.para).forEach((element: string) => {
        this.searchParagraphs(element, agendaItemId);
      });
    }
  }

  /**
   * Create a new agenda item in database.
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
   * @param {string} paragraph - The 'paragraph' string refer to the wanted paragraph in the report
   * @param {number} agendaItemId - The 'agendaItemId' number refer to the current Agenda Item id in our database
   * @return {void} return nothing.
   */

  searchParagraphs(paragraph: string, agendaItemId: number): void {
    //search
    //console.log(paragraph,agendaItemId)
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content actor name and id
   * @return {Promise<number>} actor's id.
   */
  async createActor(paragraph: any): Promise<number> {
    const actor = new Actor();
    (actor.externalId = paragraph.orateurs.orateur.id),
      (actor.name = paragraph.orateurs.orateur.nom);
    await AppDataSource.manager.save(actor);
    return actor.id;
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content text and actor's data
   * @return {Promise<number>} speech's id.
   */
  async createSpeeches(paragraph: any): Promise<number> {
    const speech = new Speech();
    speech.externalId = paragraph.content.paragraphe["@_id_syceron"];
    speech.report = this.reportId;
    speech.agendaItem = this.agendaItemId;
    speech.actor = paragraph.orateurs.orateur.id;
    speech.content = paragraph.texte;
    await AppDataSource.manager.save(speech);
    return speech.id;
  }

  /**
   * Recursive method to iterate through content.
   * @return {void} return nothing.
   */
  readContent(value: any): void {
    for (const property in value) {
      if (property === "paragraphe") {
        //console.log(value[property]);
      } else if (typeof value[property] === "object") {
        //console.log(value[property]);
        this.readContent(value[property]);
      }
    }
  }

  /**
   * Browse content inside Inter Extraction.
   * @return {void} return nothing.
   */
  readInterExtraction(): void {}

  /**
   * Browse content inside each Point.
   * @return {void} return nothing.
   */
  readPoint(): void {}

  /**
   * Read one paragraph and check if is it necessary to create a new actor and a new speech in database.
   * @param {any} paragraph - One 'paragraph' object that content text and actor data
   * @return {Promise<void>} return nothing.
   */
  async readParagraph(paragraph: any): Promise<void> {
    const actorRepository = AppDataSource.getRepository(Actor);
    const findActors = await actorRepository.findOneBy({
      externalId: paragraph.orateurs.orateur.id,
    });
    if (findActors == null) {
      await this.createActor(paragraph);
    }

    const speechRepository = AppDataSource.getRepository(Speech);
    const findSpeeches = await speechRepository.findOneBy({
      externalId: paragraph.content.paragraphe["@_id_syceron"],
    });

    if (findSpeeches == null) {
      await this.createSpeeches(paragraph);
    }
  }

  /**
   * Main method for trigger the other methods.
   * @return {Promise<void>} returns nothing or error.
   */
  async Read(): Promise<void> {
    try {
      await AppDataSource.initialize();

      await this.readMetadata();

      await this.readSummary();

      return;
    } catch (error) {
      return error;
    }
  }
}

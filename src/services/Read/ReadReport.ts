import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";

/**
 * Interfaces
 */

interface Logs {
  [key: string]: number;
}

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  /**
   * @const data - save report data for easier access inside methods
   * @const reportId - local variable to save current report id
   * @const logs - variable created for save entries logs during reading process
   */
  protected reportId: null | number = null;
  public logs: Logs = {};

  /**
   * Create a reading object.
   * @constructor
   * @param data - incoming parsed datas.
   */
  constructor(readonly data: any) {
    this.data = data.compteRendu;
  }

  /**
   * Check if current report exist in database.
   * @return {Promise<void>} report's id.
   */
  async readMetadata(): Promise<void> {
    console.log(this.data.uid)
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
          if (obj.presidentSeance) {
            delete obj.presidentSeance;
          }
          if (obj.titreStruct) {
            await this.createAgendaItems(obj.titreStruct);
            delete obj.titreStruct;
          }
          Object.keys(obj).forEach(async (key) => {
            this.readSummary(obj[key]);
          });
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Create a new agenda item in database.
   * @param {any} title - Object title with one title and his id
   * @return {Promise<void>} return nothing.
   */
  async createAgendaItems(title: any): Promise<void> {
    let fixedTitle: string = "";
    if (typeof title.intitule === "object") {
      Object.keys(title.intitule).forEach((element) => {
        fixedTitle = fixedTitle.concat(" ", title.intitule[element]).trim();
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
      item.title = fixedTitle || title.intitule;
      await AppDataSource.manager.save(item);

      await this.increaseLogsCounter("agendaItems");
    }
    await this.increaseLogsCounter("agendaItems");
  }

  /**
   * Read speeches object and call createActor() and createSpeeches() methods for save the data.
   * @param {any} pointItem - Object with actor and text content
   * @return {Promise<void>} return nothing.
   */
  async readSpeech(pointItem: any): Promise<void> {
    if (!pointItem.orateurs.orateur) {
      return;
    }

    const actorId = await this.createActor(pointItem.orateurs.orateur);
    await this.increaseLogsCounter("actors");

    await this.createSpeeches(pointItem, actorId);
    await this.increaseLogsCounter("speeches");
  }

  /**
   * Read paragraph object and call readSpeech() on each speech found.
   * @param {any} paragraph - Object with actor and text content
   * @return {Promise<void>} return nothing.
   */
  async readParagraph(paragraph: any): Promise<void> {
    if (!Array.isArray(paragraph)) {
      return this.readSpeech(paragraph);
    }

    for (const paragraphItem of paragraph) {
      await this.readSpeech(paragraphItem);
    }
  }

  /**
   * Read interExtraction object and call readParagraph() on each paragraphs found.
   * @param {any} interExtraction - Object with multiples paragraphs
   * @return {Promise<void>} return nothing.
   */
  async readInterExtraction(interExtraction: any): Promise<void> {
    if (!Array.isArray(interExtraction)) {
      const paragraph = interExtraction.paragraphe;

      return this.readParagraph(paragraph);
    }

    for (const interExtractionItem of interExtraction) {
      const paragraph = interExtractionItem.paragraphe;

      await this.readParagraph(paragraph);
    }
  }

  /**
   * Unstructure an object and trigger enhanced methods.
   * @param {any} interExtraction - Object to be destructured
   * @return {Promise<void>} return nothing.
   */
  async readPointItem(pointItem: any): Promise<void> {
    const {
      orateurs: { orateur: actor = null } = {},
      texte: text = null,
      paragraphe: paragraph = null,
      interExtraction = null,
      point = null,
    } = pointItem;

    if (actor && text !== "") {
      return this.readSpeech(pointItem);
    }

    if (paragraph) {
      await this.readParagraph(paragraph);
    }

    if (interExtraction) {
      await this.readInterExtraction(interExtraction);
    }

    if (point) {
      await this.readPoint(point);
    }
  }

  /**
   * Read point object and call readPointItem() on each items found.
   * @param {any} interExtraction - Object with one or many points
   * @return {Promise<void>} return nothing.
   */
  async readPoint(point: any): Promise<void> {
    if (!Array.isArray(point)) {
      return this.readPointItem(point);
    }

    for (const pointItem of point) {
      await this.readPointItem(pointItem);
    }
  }

  /**
   * Calls readPoint() method on content's point
   * @param {object} content - Object that needs to be checked and/or destructured
   * @return {Promise<void>} return nothing.
   */
  async readContent(content: any): Promise<void> {
    const point = content.point;

    try {
      await this.readPoint(point);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create a new actor in database.
   * @param {any} obj - The 'obj' object that content actor name and id
   * @return {Promise<number>} return actor id.
   */
  async createActor(obj: any): Promise<number> {
    const actorRepository = AppDataSource.getRepository(Actor);
    const findActors = await actorRepository.findOneBy({
      externalId: obj.id,
    });
    if (findActors && findActors.hasOwnProperty("id")) {
      return findActors.id;
    } else {
      const actor = new Actor();
      (actor.externalId = obj.id), (actor.name = obj.nom);
      await AppDataSource.manager.save(actor);
      return actor.id;
    }
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content text and actor's data
   * @param {number} actorId - The 'actorId' number refer to the speaker id in our database
   * @return {Promise<number>} return speech id.
   */
  async createSpeeches(obj: any, actorId?: number): Promise<number> {
    let fixedText: string = "";
    if (typeof obj.texte === "string") {
      fixedText = obj.texte;
    } else {
      fixedText = obj.texte["#text"];
    }

    const actorRepository = AppDataSource.getRepository(Speech);
    const findSpeech = await actorRepository.findOneBy({
      externalId: obj["@_id_syceron"],
    });
    if (findSpeech && findSpeech.hasOwnProperty("id")) {
      return findSpeech.id;
    } else {
      const speech = new Speech();
      speech.externalId = obj["@_id_syceron"];
      speech.report = this.reportId;
      speech.actor = actorId ? actorId : null;
      speech.content = fixedText;
      await AppDataSource.manager.save(speech);

      return speech.id;
    }
  }

  /**
   * Update logs object during reading process
   * @param {string} prop - target object property
   * @return {Promise<void>} return nothing.
   */
  async increaseLogsCounter(prop: string): Promise<void> {
    try {
      this.logs[prop] ? this.logs[prop]++ : (this.logs[prop] = 1);
    } catch (error) {
      throw new Error(`Can't update object logs`);
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

      await this.readContent(this.data.contenu);

      return;
    } catch (error) {
      return error;
    }
  }
}

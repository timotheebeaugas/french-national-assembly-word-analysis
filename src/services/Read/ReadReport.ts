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
  private logs: Logs = {};

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
      throw new Error(`Error in summary:${error}`);
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
   * Iterates the content of the object.
   * Reads the paragraphs one by one and checks if it is necessary to create a new actor and a new speech in the database.
   * @param {object} obj - ONbject that needs to be checked and/or destructured
   * @return {Promise<void>} return nothing.
   */

  async readContent(obj: any): Promise<void> {
    try {
      if (obj) {
        if (typeof obj === "object") {
          let actorId: number | null = null;
          Object.keys(obj).forEach(async (key) => {
            if (key === "orateurs" && obj[key].orateur) {
              actorId = await this.createActor(obj[key].orateur);
              await this.increaseLogsCounter("actors");
            }
            if (key === "texte") {
              await this.createSpeeches(obj, actorId);
              await this.increaseLogsCounter("speeches");
            }
            this.readContent(obj[key]);
          });
        }
      }
    } catch (error) {
      throw new Error(error);
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
    if (typeof obj.texte === "object") {
      Object.keys(obj.texte).forEach((element) => {
        fixedText = fixedText.concat(" ", obj.texte[element]).trim();
      });
    } else {
      fixedText = obj.texte;
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

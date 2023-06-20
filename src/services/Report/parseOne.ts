import { XMLParser } from "fast-xml-parser";

import { AppDataSource } from "../Database/Connection.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";
import { ReportManager } from '../../models/managers/index.js';
import createOne from './createOne.js';

/**
 * Interfaces
 */

interface Logs {
  [key: string]: number;
}

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
class ReadReport {
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
    if (obj.id && obj.id != 0) {
      const actorRepository = AppDataSource.getRepository(Actor);
      const findActors = await actorRepository.findOneBy({
        externalId: Math.abs(obj.id),
      });

      if (findActors && findActors.hasOwnProperty("id")) {
        return findActors.id;
      } else {
        const actor = new Actor();
        (actor.externalId = Math.abs(obj.id)), (actor.name = obj.nom);
        await AppDataSource.manager.save(actor);
        return actor.id;
      }
    }else{
      return;
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
      fixedText = obj.texte["#text"] || obj.texte.italique;
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
      await this.readContent(this.data.contenu);

      return;
    } catch (error) {
      return error;
    }
  }
}

function getExternalId(rawReport: any) {
  return rawReport.uid;
}

function getPresidency(rawReport: any) {
  const isFixedPresidency = typeof rawReport.metadonnees.sommaire.presidentSeance === 'object';

  if (isFixedPresidency) {
    return rawReport.metadonnees.sommaire.presidentSeance['#text'];
  }

  return rawReport.metadonnees.sommaire.presidentSeance;
}

function getSourceURL (rawReport: any) {
  const externalId = getExternalId(rawReport);

  return `https://www.assemblee-nationale.fr/dyn/opendata/${externalId}.xml`
}

function getLegislature(rawReport: any) {
  return rawReport.metadonnees.legislature;
}

function getDate(rawReport: any) {
  return rawReport.metadonnees.dateSeanceJour;
}

function getDaySessionNumber(rawReport: any) {
  return rawReport.metadonnees.numSeanceJour;
}

async function parseOne(file: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const parsedFile = parser.parse(file);
  const rawReport = parsedFile.compteRendu;

  const externalId = getExternalId(rawReport);

  let report = await ReportManager.findByExternalId(externalId);

  if (report) {
    return;
  }

  const presidency = getPresidency(rawReport);
  const sourceURL = getSourceURL(rawReport);
  const legislature = getLegislature(rawReport);
  const date = getDate(rawReport);
  const daySessionNumber = getDaySessionNumber(rawReport);

  report = await createOne({
    externalId,
    presidency,
    sourceURL,
    legislature,
    date,
    daySessionNumber,
  });
}

export default parseOne;

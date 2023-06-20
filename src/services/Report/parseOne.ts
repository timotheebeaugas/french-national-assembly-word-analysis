import { XMLParser } from "fast-xml-parser";

import { AppDataSource } from "../Database/Connection.js";
import { Report } from '../../models/entities/Report.entity.js';
import { Speech } from "../../models/entities/Speech.entity.js";

import {
  ActorManager,
  ReportManager,
 } from '../../models/managers/index.js';

import createOne from './createOne.js';
import * as ActorService from '../Actor/index.js';

interface Logs {
  [key: string]: number;
}

const logs: Logs = {};

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

async function increaseLogsCounter(prop: string) {
  logs[prop] ? logs[prop]++ : (logs[prop] = 1);
}

// Déplacer tout ce qui est lié au contenu dans un fichier à part
async function createSpeeches(obj: any, actorId?: number) {
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

async function parseOrateur(orateur: any) {
  if (!orateur.id || orateur.id == 0) {
    return;
  }

  const externalId = Math.abs(orateur.id);
  const existingActor = await ActorManager.findByExternalId(externalId);

  if (existingActor) {
    return existingActor;
  }

  const name = orateur.nom;

  return ActorService.createOne({
    externalId,
    name,
  });
}

async function parseParagraph(paragraph: any) {
  if (!Array.isArray(paragraph)) {
    return parseSpeech(paragraph);
  }

  for (const paragraphItem of paragraph) {
    await parseSpeech(paragraphItem);
  }
}

async function parseInterExtraction(interExtraction: any) {
  if (!Array.isArray(interExtraction)) {
    const paragraph = interExtraction.paragraphe;

    return parseParagraph(paragraph);
  }

  for (const interExtractionItem of interExtraction) {
    const paragraph = interExtractionItem.paragraphe;

    await parseParagraph(paragraph);
  }
}

async function parseSpeech(pointItem: any) {
  const rawActor = pointItem.orateurs.orateur;

  if (!rawActor) {
    return;
  }

  const actor = await parseOrateur(rawActor);

  await increaseLogsCounter('actors');

  // await createSpeeches(pointItem, actor.id);
  await increaseLogsCounter('speeches');
}

async function parsePointItem(pointItem: any) {
  const {
    orateurs: { orateur = null } = {},
    texte: text = null,
    paragraphe: paragraph = null,
    interExtraction = null,
    point = null,
  } = pointItem;

  if (orateur && text !== '') {
    return parseSpeech(pointItem);
  }

  if (paragraph) {
    await parseParagraph(paragraph);
  }

  if (interExtraction) {
    await parseInterExtraction(interExtraction);
  }

  if (point) {
    await parsePoint(point);
  }
}

async function parsePoint(point: any) {
  if (!Array.isArray(point)) {
    return this.readPointItem(point);
  }

  for (const pointItem of point) {
    await parsePointItem(pointItem);
  }
}

async function parseContent(content: any, report: Report) {
  const point = content.point;

  await parsePoint(point);
}

async function parseOne(file: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const parsedFile = parser.parse(file);
  const rawReport = parsedFile.compteRendu;

  const externalId = getExternalId(rawReport);

  const existingReport = await ReportManager.findByExternalId(externalId);

  if (existingReport) {
    return;
  }

  const presidency = getPresidency(rawReport);
  const sourceURL = getSourceURL(rawReport);
  const legislature = getLegislature(rawReport);
  const date = getDate(rawReport);
  const daySessionNumber = getDaySessionNumber(rawReport);

  const report = await createOne({
    externalId,
    presidency,
    sourceURL,
    legislature,
    date,
    daySessionNumber,
  });

  const content = rawReport.contenu;

  await parseContent(content, report);
}

export default parseOne;

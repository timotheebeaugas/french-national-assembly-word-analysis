import {
  ActorManager,
  SpeechManager,
 } from '../../../models/managers/index.js';

import * as ActorService from '../../Actor/index.js';
import * as SpeechService from '../../Speech/index.js';

async function parseActor(rawActor: any) {
  const {
    id: rawExternalId,
    nom: name
  } = rawActor;

  // Id equals 0 when it's not a specific person
  // Eg. 'Un député du groupe LR'
  if (!rawExternalId || rawExternalId === 0) {
    return null;
  }

  const externalId = Math.abs(rawExternalId);
  const existingActor = await ActorManager.findByExternalId(externalId);

  if (existingActor) {
    return existingActor;
  }

  return ActorService.createOne({
    externalId,
    name,
  });
}

async function parseSpeech(pointItem: any, reportId: number) {
  const {
    orateurs: {
      orateur: rawActor = null,
    } = {},
    texte,
  } = pointItem;

  // Get externalId
  const externalId = pointItem['@_id_syceron'];

  // Check if speech already exists
  const existingSpeech = await SpeechManager.findByExternalId(externalId);

  if (existingSpeech) {
    return existingSpeech.id;
  }

  // Get actorId
  if (!rawActor) {
    return;
  }

  const actor = await parseActor(rawActor);
  const actorId = actor?.id || null;

  // Get content
  let content = '';

  if (typeof texte === 'string') {
    content = texte;
  } else {
    content = texte['#text'] || texte.italique;
  }

  // Create speech
  const speech = await SpeechService.createOne({
    externalId,
    reportId,
    actorId,
    content
  });

  return speech.id;
}

async function parseParagraph(paragraph: any, reportId: number) {
  if (!Array.isArray(paragraph)) {
    return parseSpeech(paragraph, reportId);
  }

  for (const paragraphItem of paragraph) {
    await parseSpeech(paragraphItem, reportId);
  }
}

async function parseInterExtraction(interExtraction: any, reportId: number) {
  if (!Array.isArray(interExtraction)) {
    const paragraph = interExtraction.paragraphe;

    return parseParagraph(paragraph, reportId);
  }

  for (const interExtractionItem of interExtraction) {
    const paragraph = interExtractionItem.paragraphe;

    await parseParagraph(paragraph, reportId);
  }
}

async function parsePointItem(pointItem: any, reportId: number) {
  const {
    orateurs: {
      orateur = null,
    } = {},
    texte: text = null,
    paragraphe: paragraph = null,
    interExtraction = null,
    point = null,
  } = pointItem;

  if (orateur && text !== '') {
    return parseSpeech(pointItem, reportId);
  }

  if (paragraph) {
    await parseParagraph(paragraph, reportId);
  }

  if (interExtraction) {
    await parseInterExtraction(interExtraction, reportId);
  }

  if (point) {
    await parsePoint(point, reportId);
  }
}

async function parsePoint(point: any, reportId: number) {
  if (!Array.isArray(point)) {
    return parsePointItem(point, reportId);
  }

  for (const pointItem of point) {
    await parsePointItem(pointItem, reportId);
  }
}

async function parseContent(content: any, reportId: number) {
  const point = content.point;

  await parsePoint(point, reportId);
}

export default parseContent;

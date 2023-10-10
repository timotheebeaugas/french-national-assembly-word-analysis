import { XMLParser } from "fast-xml-parser";

import {
  ReportManager,
 } from '../../../models/managers/index.js';

import createOne from '../createOne.js';
import parseContent from './parseContent.js';

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

  let report = null;

  const existingReport = await ReportManager.findByExternalId(externalId);

  if (existingReport) {
    report = existingReport;
  } else {
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

  const content = rawReport.contenu;

  await parseContent(content, report.id);
}

export default parseOne;

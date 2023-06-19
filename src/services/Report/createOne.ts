import { Report } from '../../models/entities/Report.entity.js';
import { ReportManager } from '../../models/managers/index.js';

type reportCreationPayloadType = {
  externalId: string,
  presidency: string,
  date: string,
  daySessionNumber: string,
  legislature: string,
  sourceURL: string,
}

async function createOne(rawReport: reportCreationPayloadType) {
  const {
    externalId,
    presidency,
    sourceURL,
    legislature,
    date,
    daySessionNumber
  } = rawReport;

  const report = new Report();

  report.externalId = externalId;
  report.presidency = presidency,
  report.sourceURL = sourceURL;
  report.legislature = legislature;
  report.date = date;
  report.daySessionNumber = daySessionNumber;

  await ReportManager.insert(report);

  return ReportManager.findByExternalId(externalId);
}

export default createOne;

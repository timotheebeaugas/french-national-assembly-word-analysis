import * as fs from "fs";
import * as path from "path";

import { ParserXML } from "./src/services/Parser/ParserXML.js";
import { Fetch } from "./src/services/Fetch/Fetch.js";
import { ReadReport } from "./src/services/Read/ReadReport.js";

const CURRENT_FILE_ADRESS: string =
  "https://www.assemblee-nationale.fr/dyn/opendata/CRSANR5L16S2023O1N205.xml";
const CURRENT_FILENAME: string = path.basename(CURRENT_FILE_ADRESS);

// DOWNLOAD DATA IF THEY DOESN'T EXIST LOCALLY

try {
  const data = fs.existsSync(`tmp/${CURRENT_FILENAME}`);
  console.log(data);
  if (data) {
    // PARSING
    const report = new ParserXML("CRSANR5L16S2023O1N205");
    const parsedReport = report.parse();

    // SAVING IN LOCAL DB
    console.log(parsedReport);

  } else {
    const report = new Fetch(CURRENT_FILE_ADRESS);
    report.download();
  }
} catch (err) {
  console.log(err);
}

import * as fs from "fs";
import * as path from "path";
import { Fetch } from "./src/services/Fetch/Fetch.js";
import { Unzipper } from "./src/services/Unzipper/Unzip.js";
import { AppDataSource } from "./src/services/Database/Connection.js";

import { Report } from './src/controllers/index.js';
import { LOCAL_FILES_PATHS } from './src/constants.js';

// JOB FOR DOWNLOAD, UNZIP, PARSE AND SAVE ALL REPORTS OF THE LEGISLATURE NUMBER XVI
const readDirectoryJob = true; // is first job must be excecuted
const readOneFileJob = false; // is second job must be excecuted

const REMOTE_ADRESS =
  "https://data.assemblee-nationale.fr/static/openData/repository/16/vp/syceronbrut/syseron.xml.zip";

const FILENAME = path.basename(REMOTE_ADRESS);
const BASENAME = path.basename(REMOTE_ADRESS, ".xml.zip");

// SPECIFIC FILE JOB
// if (readOneFileJob) {
//   const fesneau1 = "CRSANR5L16S2022E1N004.xml";
//   const fesneau2 = "CRSANR5L16S2023O1N186.xml";
//   const report = new ParserXML(
//     `${BASENAME}/${path.basename(fesneau1, ".zip")}`
//   );
//   const parsedReport = report.parse();
//   // SAVING DATA IN LOCAL DB
//   AppDataSource.initialize().then(async () => {
//     const saveReport = parseOne(parsedReport);
//     const readRowReport = new ReadStringifyReport(report.rawdata);
//     console.log(readRowReport.testReport());
//     await saveReport.Read();
//     console.log(saveReport.logs);
//   });
// }

async function readDirectory() {
  // IF ZIP FILE HAS BEEN DOWNLOADED LOCALLY
  let file = fs.existsSync(`tmp/${FILENAME}`);

  if (file) {
    let unzipped = fs.existsSync(`tmp/${BASENAME}`);

    if (unzipped) {
      console.log("READ FILE");

      const folder = fs.readdirSync(`tmp/${BASENAME}`);

      const [file1, file2, file3] = folder;

      for (const fileName of [file1, file2, file3]) {
        const filePath = `${LOCAL_FILES_PATHS}syseron/${fileName}`;

        await Report.parseOne(filePath);

        console.log('Done', fileName);
      }

      console.log('FINISHED');
    }
    else {
      // UNZIP THE FILE
      console.log("UNZIP FILE");
      const unzipper = new Unzipper();
      unzipper.unzipFile(FILENAME, BASENAME);
    }
  } else {
    // IF NOT DOWNLOAD THE REPORT BY REMOTE URL
    console.log("DOWNLOAD FILE");
    const report = new Fetch(REMOTE_ADRESS);
    report.download();
  }

}

AppDataSource.initialize()
  .then(async () => {
    if (readDirectoryJob) {
      await readDirectory();
    }
  });

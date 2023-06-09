import * as fs from "fs";
import * as path from "path";
import { ParserXML } from "./src/services/Parser/ParserXML.js";
import { Fetch } from "./src/services/Fetch/Fetch.js";
import { ReadReport } from "./src/services/Read/ReadReport.js";
import { Unzipper } from "./src/services/Unzipper/Unzip.js";
import { ReadStringifyReport } from "./src/services/Read/ReadStringifyReport.js";
import { AppDataSource } from "./src/services/Database/Connection.js";
import { Actor } from "./src/models/entities/Actor.entity.js";

// JOB FOR DOWNLOAD, UNZIP, PARSE AND SAVE ALL REPORTS OF THE LEGISLATURE NUMBER XVI
const readDirectoryJob = true; // is first job must be excecuted
const readOneFileJob = false; // is second job must be excecuted
const REMOTE_ADRESS =
  "https://data.assemblee-nationale.fr/static/openData/repository/16/vp/syceronbrut/syseron.xml.zip";
const FILENAME = path.basename(REMOTE_ADRESS);
const BASENAME = path.basename(REMOTE_ADRESS, ".xml.zip");

// MULTIPLE FILES JOB
if (readDirectoryJob) {
  try {
    // IF ZIP FILE HAS BEEN DOWNLOADED LOCALLY
    let file = fs.existsSync(`tmp/${FILENAME}`);
    if (file) {
      // IF FILE HAS BEEN UNZIPPED
      let unzipped = fs.existsSync(`tmp/${BASENAME}`);
      if (unzipped) {
        // READ FILE
        console.log("READ FILE");
        let folder = fs.readdirSync(`tmp/${BASENAME}`);
        AppDataSource.initialize().then(async () => {
          folder.forEach(async (file, position) => {
            // PARSING ONE EACH REPORTS
            const report = new ParserXML(
              `${BASENAME}/${path.basename(file, ".zip")}`
            );
            const parsedReport = report.parse();
            setTimeout(async () => {
              // SAVING DATA IN LOCAL DB
              console.log("SAVING DATA");
              const saveReport = new ReadReport(parsedReport);
              //const readRowReport = new ReadStringifyReport(report.rawdata);
              //console.log(readRowReport.testReport())
              await saveReport.Read();
            }, 60000);
          });
        });
      } else { 
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
  } catch (err) {
    // PRINT ERR(S)
    console.log(err);
  }
}

// SPECIFIC FILE JOB
if (readOneFileJob) {
  const fesneau1 = "CRSANR5L16S2022E1N004.xml";
  const fesneau2 = "CRSANR5L16S2023O1N186.xml";
  const report = new ParserXML(
    `${BASENAME}/${path.basename(fesneau1, ".zip")}`
  );
  const parsedReport = report.parse();
  // SAVING DATA IN LOCAL DB
  AppDataSource.initialize().then(async () => {
    const saveReport = new ReadReport(parsedReport);
    const readRowReport = new ReadStringifyReport(report.rawdata);
    console.log(readRowReport.testReport());
    await saveReport.Read();
    console.log(saveReport.logs);
  });
}

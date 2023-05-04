import * as fs from "fs";
import * as path from "path";
import { ParserXML } from "./src/services/Parser/ParserXML.js";
import { Fetch } from "./src/services/Fetch/Fetch.js";
import { ReadReport } from "./src/services/Read/ReadReport.js";
import { Unzipper } from "./src/services/Unzipper/Unzip.js";

// JOB FOR DOWNLOAD, UNZIP, PARSE AND SAVE ALL REPORTS OF THE LEGISLATURE NUMBER XVI
const job = false; // is job must be excecuted
const REMOTE_ADRESS =
  "https://data.assemblee-nationale.fr/static/openData/repository/16/vp/syceronbrut/syseron.xml.zip";
const FILENAME = path.basename(REMOTE_ADRESS);
const BASENAME = path.basename(REMOTE_ADRESS, ".xml.zip");

if (job) {
  try {
    // IF ZIP FILE HAS BEEN DOWNLOADED LOCALLY
    let file = fs.existsSync(`tmp/${FILENAME}`);
    if (file) {
      // IF FILE HAS BEEN UNZIPPED
      let unzipped = fs.existsSync(`tmp/${BASENAME}`);
      if (unzipped) {
        let folder = fs.readdirSync(`tmp/${BASENAME}`);

        folder.forEach((file) => {
        
          // PARSING ONE EACH REPORTS
          const report = new ParserXML(`${BASENAME}/${path.basename(file, ".zip")}`);
          const parsedReport = report.parse();

          // SAVING DATA IN LOCAL DB
          (async () => {
            const saveReport = new ReadReport(report.rawdata, parsedReport);
            await saveReport.Read();
          })();
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

let file = "CRSANR5L16S2023O1N216.xml.zip"
const report = new ParserXML(`${BASENAME}/${path.basename(file, ".zip")}`);
const parsedReport = report.parse();

// SAVING DATA IN LOCAL DB
(async () => {
  const saveReport = new ReadReport(report.rawdata, parsedReport);
  await saveReport.Read();
  console.log(saveReport.logs)
})();
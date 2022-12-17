/** First of all.
 * Import configuration files. 
*/

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({path: './config/.env'})

/* import axios from "axios";

const LOCALFILE: localFile = {
  input: "./tmp/publicDebateReports.zip",
  output: "./tmp/unzippedPublicDebateReports.xml"
}

>>>>>>> 9f8b472... .
const downloadZipFile = new Promise((resolve, reject) => {
  axios({url: URL.value, method: 'get', responseType: 'stream'})
  .then(function (response) {
    resolve(response.data)
  })
  .catch(function (error) {
    reject(error) 
  })
});
<<<<<<< HEAD
>>>>>>> 21269f2... remastering config and constants

<<<<<<< HEAD
test.unzipOneFile("publicDebateReports.zip")
=======
/* downloadZipFile
  .then((data: any)=>{
    data.pipe(fs.createWriteStream(LOCALFILE.input));  
  }); */

/* import { LOCAL_TMP_PATHS } from "./utils/env"
console.log(LOCAL_TMP_PATHS) */

import { ParserXML } from "./src/services/Parser/ParserXML.js";

const test = new ParserXML("unzippedPublicDebateReports");
test.readFile()
test.parse()
test.saveData()
console.log(test.parsedData) 
<<<<<<< HEAD
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
=======
 */

import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper()

test.unzipOneFile("publicDebateReports.zip")
>>>>>>> f5ab689... unzip
=======

/* downloadZipFile
  .then((data: any)=>{
    data.pipe(fs.createWriteStream(LOCALFILE.input));  
  }); */

/* import { LOCAL_FILES_PATHS } from "./utils/env"
console.log(LOCAL_FILES_PATHS) */

/* import { ParserXML } from "./src/services/Parser/ParserXML.js";

const test = new ParserXML("unzippedPublicDebateReports");
test.readFile()
test.parse()
test.saveData()
console.log(test.parsedData) 
 */

import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper("publicDebateReports.zip")
console.log(test)
console.log(test.unzipOneFile())
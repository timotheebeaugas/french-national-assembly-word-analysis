/** First of all.
 * Import configuration files. 
*/

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({path: './config/.env'})

/* import axios from "axios";

const LOCALFILE: localFile = {
  input: "./tmp/publicDebateReports.zip",
  output: "./tmp/unzippedPublicDebateReports.xml"
}

const downloadZipFile = new Promise((resolve, reject) => {
  axios({url: URL.value, method: 'get', responseType: 'stream'})
  .then(function (response) {
    resolve(response.data)
  })
  .catch(function (error) {
    reject(error) 
  })
});

/* downloadZipFile
  .then((data: any)=>{
    data.pipe(fs.createWriteStream(LOCALFILE.input));  
  }); */

/* import { LOCAL_TMP_PATHS } from "./utils/env"
console.log(LOCAL_TMP_PATHS) */

/* import { ParserXML } from "./src/services/Parser/ParserXML.js";

const test = new ParserXML("unzippedPublicDebateReports");
test.readFile()
test.parse()
test.saveData()
console.log(test.parsedData) 
 */

import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper()

test.unzipOneFile("publicDebateReports.zip")

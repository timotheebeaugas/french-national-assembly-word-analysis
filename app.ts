/** First of all.
 * Import configuration files. 
*/

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({path: './config/.env'})

import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper()

<<<<<<< HEAD
test.unzipOneFile("publicDebateReports.zip")
=======
/* downloadZipFile
  .then((data: any)=>{
    data.pipe(fs.createWriteStream(LOCALFILE.input));  
  }); */

import { ParserXML } from "./src/services/Parser/ParserXML.js";

const test = new ParserXML("unzippedPublicDebateReports");
test.readFile()
test.parse()
test.saveData()
console.log(test.parsedData) 
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript

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

import { ParserAbstract, twoPi } from "./src/services/Parser/ParserAbstract";
import { ParserXML } from "./src/services/Parser/ParserXML";

//const test = new ParserAbstract("foo")

console.log(twoPi);
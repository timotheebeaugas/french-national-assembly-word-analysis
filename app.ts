/* ;

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

/* import { LOCAL_FILES_PATHS } from "./utils/env"
console.log(LOCAL_FILES_PATHS) */

import axios from "axios"

const REMOTE_DATA_SOURCE_URL: string = "https://www.assemblee-nationale.fr/dyn/opendata/CRSANR5L16S2023O1N204.xml"

async function getFile() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
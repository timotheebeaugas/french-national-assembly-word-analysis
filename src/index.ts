import axios from "../node_modules/axios/index";
const CronJob = require('cron').CronJob;
const fs = require("fs");

interface Url {
  value: string;
}

interface localFile {
  input: string,
  output: string
}

const URL: Url = {
  value: process.env.SOURCE_FILE,
} 

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

let job = new CronJob(
  '0 0 * * *', 
  function() {
    // run task here
  },
  null,
  true,
  'Europe/Paris'
  );

const zlib = require('zlib');

var yauzl = require("yauzl");

yauzl.open(LOCALFILE.input, {lazyEntries: true}, function(err:any, zipfile:any) {
  if (err) throw err;
  zipfile.readEntry();
  zipfile.on("entry", function(entry:any) {
    if (/\/$/.test(entry.fileName)) {
      // Directory file names end with '/'.
      // Note that entries for directories themselves are optional.
      // An entry's fileName implicitly requires its parent directories to exist.
      zipfile.readEntry();
    } else {
      // file entry
      zipfile.openReadStream(entry, function(err:any, readStream:any) {
        if (err) throw err;
        readStream.on("end", function() {
          zipfile.readEntry();
        });
        readStream.pipe(fs.createWriteStream(LOCALFILE.output));
      });
    }
  });
});
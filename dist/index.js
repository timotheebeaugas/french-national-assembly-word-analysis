"use strict";
exports.__esModule = true;
var index_1 = require("../node_modules/axios/index");
var CronJob = require('cron').CronJob;
var fs = require("fs");
var URL = {
    value: process.env.SOURCE_FILE
};
var LOCALFILE = {
    input: "./tmp/publicDebateReports.zip",
    output: "./tmp/unzippedPublicDebateReports.xml"
};
var downloadZipFile = new Promise(function (resolve, reject) {
    (0, index_1["default"])({ url: URL.value, method: 'get', responseType: 'stream' })
        .then(function (response) {
        resolve(response.data);
    })["catch"](function (error) {
        reject(error);
    });
});
var job = new CronJob('0 0 * * *', function () {
}, null, true, 'Europe/Paris');
var zlib = require('zlib');
var yauzl = require("yauzl");
yauzl.open(LOCALFILE.input, { lazyEntries: true }, function (err, zipfile) {
    if (err)
        throw err;
    zipfile.readEntry();
    zipfile.on("entry", function (entry) {
        if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
        }
        else {
            zipfile.openReadStream(entry, function (err, readStream) {
                if (err)
                    throw err;
                readStream.on("end", function () {
                    zipfile.readEntry();
                });
                readStream.pipe(fs.createWriteStream(LOCALFILE.output));
            });
        }
    });
});

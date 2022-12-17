import yauzl from "yauzl";
import fs from "fs";
import { LOCAL_TMP_PATHS } from "../../../utils/constants.js";
export class Unzipper {
    constructor() {
        this.outputFileType = ".xml";
    }
    error(message) {
        throw new Error(message);
    }
    unzipOneFile(fileName) {
        try {
            yauzl.open(LOCAL_TMP_PATHS.input + fileName, { lazyEntries: true }, function (err, zipfile) {
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
                            readStream.pipe(fs.createWriteStream(LOCAL_TMP_PATHS.output + fileName + '.xml'));
                        });
                    }
                });
            });
        }
        catch (err) {
            this.error(err);
        }
    }
}

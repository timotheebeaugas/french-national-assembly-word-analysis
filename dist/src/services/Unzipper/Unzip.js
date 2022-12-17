import * as fs from "fs";
import * as yauzl from "yauzl";
import { LOCAL_FILES_PATHS } from "../../../utils/constants.js";
export class Unzipper {
    constructor(fileName) {
        this.fileName = fileName;
        this.outputFileName = null;
    }
    error(message) {
        throw new Error(message);
    }
    unzipOneFile() {
        try {
            yauzl.open(LOCAL_FILES_PATHS.input + this.fileName, { lazyEntries: true }, function (err, zipfile) {
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
                            readStream.pipe(fs.createWriteStream(LOCAL_FILES_PATHS.output));
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

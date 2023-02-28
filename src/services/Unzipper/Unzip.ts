import yauzl from "yauzl";
import fs from "fs";
import { LOCAL_TMP_PATHS } from "../../../utils/constants.js";

/** Class for open and unzip a file  */
export class Unzipper {
  private readonly outputFileType: string;

  /**
   * Create a unzipper.
   * @const outputFileType - ".xml"
   */

  constructor() {
    this.outputFileType = ".xml";
  }

  /**
   * Throw an exception.
   * @param message - The error message value.
   * Print error message.
   * @return
   */

  error(message: string): never {
    throw new Error(message);
  }

  /**
   * Open and unzip a file method with package
   * @param fileName - The filename value.
   * @return when the work is done or @function error if an error occur
   */
  //return LOCAL_TMP_PATHS.output + fileName + this.outputFileType
  unzipOneFile(fileName: string): void {
    try {
      yauzl.open(
        LOCAL_TMP_PATHS.input + fileName,
        { lazyEntries: true },
        function (err, zipfile) {
          if (err) throw err;
          zipfile.readEntry();
          zipfile.on("entry", function (entry) {
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
            } else {
              zipfile.openReadStream(entry, function (err, readStream) {
                if (err) throw err;
                readStream.on("end", function () {
                  zipfile.readEntry();
                });
                readStream.pipe(
                  fs.createWriteStream(
                    LOCAL_TMP_PATHS.output + fileName + ".xml"
                  )
                );
              });
            }
          });
        }
      );
    } catch (err) {
      this.error(err);
    }
  }
}

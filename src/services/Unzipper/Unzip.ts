import * as yauzl from "yauzl";
import * as fs from "fs";
import * as path from "path";
import { LOCAL_FILES_PATHS } from "../../constants.js";

/** Class for open and unzip a file(s)  */
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
   * @param baseName - The base value for create output directory.
   * @return when the work is done or @function error if an error occur
   */
  unzipFile(fileName: string, baseName: string): void {
    try {
      yauzl.open(
        `${LOCAL_FILES_PATHS}${fileName}`, // input filename
        { lazyEntries: true },
        function (err: Error, zipfile: any) {
          if (err) throw err;
          zipfile.readEntry();
          zipfile.on("entry", (entry: any) => {
            if (/\/$/.test(entry.fileName)) { 
              zipfile.readEntry();
            } else {
              zipfile.openReadStream(
                entry,
                function (err: Error, readStream: any) {
                  if (err) throw err;
                  readStream.on("end", function () {
                    zipfile.readEntry(); 
                  }); 
                  let extractPath = `${LOCAL_FILES_PATHS}${baseName}`;
                  if(!fs.existsSync(extractPath)) fs.mkdirSync(extractPath); // create output directory before files extraction
                  readStream.pipe( 
                    fs.createWriteStream( 
                      path.join(extractPath, path.basename(`${entry.fileName}`)) // output filename
                    )
                  ); 
                }
              ); 
            }
          });
        }
      ); 
    } catch (err) {
      this.error(err);
    }
  }
}

import * as fs from "fs";
import * as yauzl from "yauzl";
import { LOCAL_FILES_PATHS } from "../../../utils/constants.js"

/** Class for open and unzip a file  */
export class Unzipper {

  public readonly outputFileName: string;

  /**
   * Create a unzipper.
   * @param {string} fileName - The filename value.
   * @const {string} outputFileName - ".xml"
   */

  constructor(readonly fileName: string) {
    this.outputFileName = null;
  }

    /**
   * Throw an exception.
   * @param {string} message - The error message value.
   * Print error message.
   * @return {never} 
   */

  error(message: string): never {
      throw new Error(message);
    }

  /**
   * Open and unzip a file method with yauzl package
   * @return {string} when the work is done or @function error if an error occur
   */

  unzipOneFile(): void{
    try{
      yauzl.open(LOCAL_FILES_PATHS.input + this.fileName , {lazyEntries: true}, function(err: Error, zipfile: any) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", function(entry: any) {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, function(err: Error, readStream: any) {
              if (err) throw err;
              readStream.on("end", function() {
                zipfile.readEntry(); 
              }); 
              readStream.pipe(fs.createWriteStream(LOCAL_FILES_PATHS.output));
              //this.outputFileName = this.fileName + ".xml"
            });
          }
        });
      });
    }catch(err){
      this.error(err);
    }
  }
}
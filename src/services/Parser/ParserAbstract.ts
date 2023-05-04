import * as fs from "fs";

import { LOCAL_FILES_PATHS } from "../../constants.js"

/** Parent class for parsing raw data  */

export abstract class ParserAbstract {

  public rawdata: string;

  /**
   * Create a parser.
   * @param fileName - The filename value.
   * @const rawdata - null
   */

  constructor(public fileName: string) {
    this.rawdata = null;
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
   * Open the file and stringify data.
   * Store value as string in protected const
   * @return
   */
 
  readFile(): void {
    try {
      const data = fs.readFileSync(
        `${LOCAL_FILES_PATHS}${this.fileName}`,
        { encoding: "utf8", flag: "r" }
      );
      this.rawdata = data;
    } catch {
      this.error("cannot read this file");
    }
  }

  /** 
   * @abstract for for inheritance
   * @return
   */

  abstract parse(): void;
}

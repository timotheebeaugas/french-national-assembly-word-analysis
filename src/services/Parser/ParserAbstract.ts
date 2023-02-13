import * as fs from "fs";
import { ParsedData, MetaData, Content } from "./Types";
import { LOCAL_FILES_PATHS } from "../../constants.js"

/** Parent class for parsing raw data  */

export abstract class ParserAbstract {

  protected rawdata: string;
  protected fileType: string;
  public parsedData: ParsedData;
  public parsedContentData: Partial<Content>;
  public parsedMetaData: Partial<MetaData>;

  /**
   * Create a parser.
   * @param {string} fileName - The filename value.
   * @const {string} rawdata - null
   * @const {Partial<MetaData>} parsedMetaData - null
   */

  constructor(readonly fileName: string) {
    this.rawdata = null;
    this.parsedMetaData = null;
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
   * Open the file and stringify data.
   * Store value as string in protected const
   * @return {void} 
   */
 
  readFile(): void {
    
    try {
      const data = fs.readFileSync(
        `${LOCAL_FILES_PATHS.input} + ${this.fileName} + ${this.fileType}`,
        { encoding: "utf8", flag: "r" }
      );
      this.rawdata = data;
    } catch {
      this.error("cannot read this file");
    }
  }

  /** 
   * Store parsed data in public const
   * @return {void} 
   */

  saveData(): void {
    const data = this.parsedData;
    if (data) {
      this.parsedMetaData = data.compteRendu.metadonnees;
      this.parsedContentData = data.compteRendu.contenu;
      try {
      } catch {
        this.error("cannot find parsed data");
      }
    } else {
      this.error("no past data to process");
    }
  }

  /** 
   * @abstract for for inheritance
   * @return {void} 
   */

  abstract parse(): void;
}

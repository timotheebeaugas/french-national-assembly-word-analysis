<<<<<<< HEAD
import fs from "fs";
import { ParsedData, MetaData, Content } from "./Types";
import { LOCAL_TMP_PATHS } from "../../constants.js"

<<<<<<< HEAD
/** Parent class for parsing raw data  */

export abstract class ParserAbstract {

=======
=======
import * as fs from "fs";
>>>>>>> 21269f2... remastering config and constants
import { ParsedData, MetaData, Content } from "./Types";
import {LOCAL_FILES_PATHS} from "../../../utils/constants.js"

/** Parent class for parsing raw data  */

export abstract class ParserAbstract {
<<<<<<< HEAD
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
=======

>>>>>>> 21269f2... remastering config and constants
  protected rawdata: string;
  protected fileType: string;
  public parsedData: ParsedData;
  public parsedContentData: Partial<Content>;
  public parsedMetaData: Partial<MetaData>;

<<<<<<< HEAD
<<<<<<< HEAD
  /**
   * Create a parser.
   * @param fileName - The filename value.
   * @const rawdata - null
   * @const parsedMetaData - null
   */

=======
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
=======
  /**
   * Create a parser.
   * @param {string} fileName - The filename value.
   * @const {string} rawdata - null
   * @const {Partial<MetaData>} parsedMetaData - null
   */

>>>>>>> 21269f2... remastering config and constants
  constructor(readonly fileName: string) {
    this.rawdata = null;
    this.parsedMetaData = null;
  }

<<<<<<< HEAD
<<<<<<< HEAD
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
        `${LOCAL_TMP_PATHS.input} + ${this.fileName} + ${this.fileType}`,
        { encoding: "utf8", flag: "r" }
      );
      this.rawdata = data;
    } catch {
      this.error("cannot read this file");
    }
  }

  /** 
   * Store parsed data in public const
   * @return
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
   * @return
   */

=======
=======
  /**
   * Throw an exception.
   * @param {string} message - The error message value.
   * Print error message.
   * @return {never} 
   */

>>>>>>> 21269f2... remastering config and constants
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
        LOCAL_FILES_PATHS.input + this.fileName + this.fileType,
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

<<<<<<< HEAD
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
=======
  /** 
   * @abstract for for inheritance
   * @return {void} 
   */

>>>>>>> 21269f2... remastering config and constants
  abstract parse(): void;
}

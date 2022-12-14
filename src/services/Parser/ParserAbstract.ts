import fs from "fs";
import { ParsedData, MetaData, Content } from "./Types";
import { LOCAL_TMP_PATHS } from "../../constants.js"

<<<<<<< HEAD
/** Parent class for parsing raw data  */

export abstract class ParserAbstract {

=======
import { ParsedData, MetaData, Content } from "./Types";

export abstract class ParserAbstract {
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
  protected rawdata: string;
  protected fileType: string;
  public parsedData: ParsedData;
  public parsedContentData: Partial<Content>;
  public parsedMetaData: Partial<MetaData>;

<<<<<<< HEAD
  /**
   * Create a parser.
   * @param fileName - The filename value.
   * @const rawdata - null
   * @const parsedMetaData - null
   */

=======
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
  constructor(readonly fileName: string) {
    this.rawdata = null;
    this.parsedMetaData = null;
  }

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
  error(message: string): never {
    throw new Error(message);
  }

  readFile(): void {
    try {
      const data = fs.readFileSync(
        process.env.LOCAL_INPUT + this.fileName + this.fileType,
        { encoding: "utf8", flag: "r" }
      );
      this.rawdata = data;
    } catch {
      this.error("cannot read this file");
    }
  }

  saveData() {
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

>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
  abstract parse(): void;
}

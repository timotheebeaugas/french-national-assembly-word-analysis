<<<<<<< HEAD
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
=======
import fs from "fs";
>>>>>>> f5ab689... unzip
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

import { ParsedData, MetaData, Content } from "./Types";

export abstract class ParserAbstract {
  protected rawdata: string;
  protected fileType: string;
  public parsedData: ParsedData;
  public parsedContentData: Partial<Content>;
  public parsedMetaData: Partial<MetaData>;

  constructor(readonly fileName: string) {
    this.rawdata = null;
    this.parsedMetaData = null;
  }

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

  abstract parse(): void;
}

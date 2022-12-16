import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
<<<<<<< HEAD
<<<<<<< HEAD

/** Child class for parsing raw data  */
=======
import { ParsedData, MetaData } from "./Types";

/*
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript
=======

/** Child class for parsing raw data  */
>>>>>>> 21269f2... remastering config and constants

export class ParserXML extends ParserAbstract {

  /**
   * Create a parser.
<<<<<<< HEAD
   * @param fileName - The filename value.
   * @const fileType - .xml format
   */

  constructor(fileName: string) {
    super(fileName);
    this.fileType = ".xml";
  }

  /**
   * Parse data with external package named fast-xml-parser.
   * @return 
   */

  parse(): void {
    try {
      const parser = new XMLParser();
      const JSONObject = parser.parse(this.rawdata);
      this.parsedData = JSONObject;
    } catch {
      this.error("cannot parse data");
    }
  }
} */
=======
   * @param {string} fileName - The filename value.
   * @const {string} fileType - .xml format
   */
>>>>>>> 21269f2... remastering config and constants

  constructor(fileName: string) {
    super(fileName);
    this.fileType = ".xml";
  }

  /**
   * Parse data with external package named fast-xml-parser.
   * @return {void} 
   */

  parse(): void {
    try {
      const parser = new XMLParser();
      const JSONObject = parser.parse(this.rawdata);
      this.parsedData = JSONObject;
    } catch {
      this.error("cannot parse data");
    }
  }
}

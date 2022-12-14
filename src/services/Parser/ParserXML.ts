import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { ParsedData, MetaData } from "./Types";

/*

export class ParserXML extends ParserAbstract {

  /**
   * Create a parser.
<<<<<<< HEAD
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
=======
   * @param fileName - The filename value.
   * @const fileType - .xml format
>>>>>>> f5ab689... unzip
   */
>>>>>>> 21269f2... remastering config and constants

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

export class ParserXML extends ParserAbstract {
  constructor(fileName: string) {
    super(fileName);
    this.fileType = ".xml";
  }

  parse() {
    try {
      const parser = new XMLParser();
      const JSONObject = parser.parse(this.rawdata);
      this.parsedData = JSONObject;
    } catch {
      this.error("cannot parse data");
    }
  }
}

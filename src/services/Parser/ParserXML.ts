import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

/** Child class for parsing raw data  */

export class ParserXML extends ParserAbstract {

  /**
   * Create a parser.
   * @param {string} fileName - The filename value.
   * @const {string} fileType - .xml format
   */

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

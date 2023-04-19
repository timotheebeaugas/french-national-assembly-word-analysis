import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

/** Child class for parsing raw data  */

export class ParserXML extends ParserAbstract {
  /**
   * Create a parser.
   * @param fileName - The filename value.
   * @const fileType - .xml format
   */

  constructor(public fileName: string) {
    super(fileName);
    this.fileType = ".xml";
  }

  /**
   * Parse data with external package named fast-xml-parser.
   * @return {Object} return parsed data in one object
   */

  parse(): Object {
    this.readFile();
    try {
      const options = {
        ignoreAttributes: false,
      };
      const parser = new XMLParser(options);
      const JSONObject = parser.parse(this.rawdata);
      return JSONObject;
    } catch {
      this.error("cannot parse data");
    }
  }
}

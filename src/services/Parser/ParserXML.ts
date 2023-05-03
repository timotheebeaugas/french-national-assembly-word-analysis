import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

/** Child class for parsing raw data  */

export class ParserXML extends ParserAbstract {
  /**
   * Create a parser.
   * @param fileName - The filename value.
   */

  constructor(public fileName: string) {
    super(fileName);
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

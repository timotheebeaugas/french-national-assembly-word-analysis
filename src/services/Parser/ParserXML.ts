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
   * @return 
   */

  parse(): void {
    this.readFile();
    try {
      const parser = new XMLParser();
      const JSONObject = parser.parse(this.rawdata);
      this.parsedData = JSONObject;
    } catch {
      this.error("cannot parse data");
    }
  }
}

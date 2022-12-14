import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
<<<<<<< HEAD

/** Child class for parsing raw data  */
=======
import { ParsedData, MetaData } from "./Types";

/*
>>>>>>> db48bbb... dev parserAbstract and parserXML w/ TypeScript

export class ParserXML extends ParserAbstract {

  /**
   * Create a parser.
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

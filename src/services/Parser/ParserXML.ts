import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { ParsedData, MetaData } from "./Types";

/*

export class ParserXML extends ParserAbstract {
  _length = 0;
  _fileType = ".xml";

  constructor(public fileName: string){
    super(fileName)
  }
  
  set length(value: number) {
    this._length = value;
  }

  parse(){
    const options = {
      ignoreAttributes : true
    };
    this.readFileContent(".xml")
    const parser = new XMLParser();
    const jObj = parser.parse(this._rowdata)
    this._parsedData = jObj
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

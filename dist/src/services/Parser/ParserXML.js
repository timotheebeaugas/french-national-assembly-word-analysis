import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser } from "fast-xml-parser";
export class ParserXML extends ParserAbstract {
    constructor(fileName) {
        super(fileName);
        this.fileName = fileName;
        this._length = 0;
        this._fileType = ".xml";
    }
    set length(value) {
        this._length = value;
    }
    parse() {
        const options = {
            ignoreAttributes: true
        };
        this.readFileContent(".xml");
        const parser = new XMLParser();
        const jObj = parser.parse(this._rowdata);
        this._parsedData = jObj;
    }
}

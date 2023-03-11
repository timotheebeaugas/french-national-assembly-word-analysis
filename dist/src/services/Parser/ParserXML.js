import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser } from "fast-xml-parser";
export class ParserXML extends ParserAbstract {
    constructor(fileName) {
        super(fileName);
        this.fileType = ".xml";
    }
    parse() {
        try {
            const parser = new XMLParser();
            const JSONObject = parser.parse(this.rawdata);
            this.parsedData = JSONObject;
        }
        catch (_a) {
            this.error("cannot parse data");
        }
    }
}

import { ParserAbstract } from "./ParserAbstract.js";
import { XMLParser, XMLBuilder} from "fast-xml-parser";

interface Data<Type> {
  date: Type;
  title: Type;
  quotes: Type;
}

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
}
 
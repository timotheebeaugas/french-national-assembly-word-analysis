const ParserAbstract = require("./ParserAbstract.ts");

export class ParserXML extends ParserAbstract {
  constructor(readonly fileName: string, _data: unknown) {
    super(fileName, _data);
  }
  parseXML(_data: unknown){
    this._data = "xml"
  }
}

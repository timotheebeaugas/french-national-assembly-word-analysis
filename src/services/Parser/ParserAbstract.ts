import * as fs from "fs";

export class ParserAbstract {
  public _rowdata: string;
  public _parsedData: string;

  constructor(public fileName: string) {
    this._rowdata = null;
  }

  readFileContent(fileType: string){
    const data = fs.readFileSync('./tmp/' + this.fileName + fileType, {encoding:'utf8', flag:'r'});
    this._rowdata = data
  }

}
  
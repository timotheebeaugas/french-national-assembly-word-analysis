import * as fs from "fs";
export class ParserAbstract {
    constructor(fileName) {
        this.fileName = fileName;
        this._rowdata = null;
    }
    readFileContent(fileType) {
        const data = fs.readFileSync('./tmp/' + this.fileName + fileType, { encoding: 'utf8', flag: 'r' });
        this._rowdata = data;
    }
}

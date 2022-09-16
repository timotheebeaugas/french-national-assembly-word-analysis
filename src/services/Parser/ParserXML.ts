const ParserAbstract = require("./ParserAbstract.ts");

class ParserXML extends ParserAbstract {
  constructor(readonly fileName: string) {
    super(fileName);
  }
  getDate() {
    return this.run().date;
  }
  getTitle() {
    return this.run().title;
  }
  getQuotes() {
    return this.run().quotes;
  }
}

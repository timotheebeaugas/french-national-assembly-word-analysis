export class ParserAbstract {
  readonly fileName: string;

  constructor(file: string) {
    this.fileName = file;
  }

  data: {
    date: string;
    title: string;
    quotes: string;
  };

  run() {
    return this.data
  }
}


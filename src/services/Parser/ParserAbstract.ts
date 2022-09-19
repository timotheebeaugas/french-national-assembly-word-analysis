interface Data<Type> {
  date: Type;
  title: Type;
  quotes: Type;
}

export class ParserAbstract {
  readonly _file: string;

  constructor(fileName: string) {
    this._file = fileName;
  }

}
  
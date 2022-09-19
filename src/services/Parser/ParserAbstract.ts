export class ParserAbstract {
  readonly fileName: string;
  private _data: unknown;

  constructor(file: string) {
    this.fileName = file;
    this._data = null;
  }

  run() {
    return this._data
  }
}

export const twoPi = 1 * 3; 
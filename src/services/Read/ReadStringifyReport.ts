/**
 * Interfaces
 */

interface Logs {
  [key: string]: number;
}

/** Read the document with regex to make a comparison with the method ReadReport  */
export class ReadStringifyReaport {
  /**
   * @const dataString - Unparsed data in string format for analysis in parallel to reading
   * @const logs - variable created for save entries logs during reading process
   */
  protected reportId: null | number = null;
  private logs: Logs = { report: 0, agendaItems: 0, speeches: 0, actors: 0 };

  /**
   * Create a reading object.
   * @constructor
   * @param dataString - incoming unparsed datas.
   */
  constructor(readonly dataString: string) {
    this.dataString = dataString;
  }

  /**
   * Test unparsed data with regex for compare the result with the work done by the reading methods.
   */
  async testReport(): Promise<Logs> {
    try {
      const regex: RegExp[] = [
        /<uid>/gi,
        /<\/titreStruct>/gi,
        /<orateur>/gi,
        /<texte stime=/gi,
      ];
      let i = 0;

      for (const prop in this.logs) {
        const found = this.dataString.match(regex[i]);
        this.logs[prop] = found.length;
        i++;
      }

      return this.logs
    } catch (error) {
      throw new Error(`Can't test this Report`);
    }
  }
}

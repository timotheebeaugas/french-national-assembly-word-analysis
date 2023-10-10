import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import { LOCAL_FILES_PATHS } from "../../constants.js";

export class Fetch {
  public fileName: string;
  protected rawData: any;

  /**
   * Create a fetcher.
   * @param {string} remoteSourceUrl - source file URL to fetch.
   * @const {string} fileName - Store base name of remote file.
   * @const {any} rawData - row data downloaded from remote website
   */

  constructor(public remoteSourceUrl: string) {
    this.fileName = null;
    this.rawData = null;
  }

  /**
   * Test remote address and save fetched data
   * @return {void}
   */

  async download(): Promise<void> {
    try {
      const response: any = await fetch(this.remoteSourceUrl);
      if (response.status == "200") {
        this.fileName = path.basename(response.url);
        await response.body.pipe(
          fs.createWriteStream(`${LOCAL_FILES_PATHS}${this.fileName}`)
        );
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

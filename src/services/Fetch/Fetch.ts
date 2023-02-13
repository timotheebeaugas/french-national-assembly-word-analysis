import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import {
  LOCAL_FILES_PATHS,
  REMOTE_DATA_SOURCE_URL,
} from "../../../utils/constants.js";

export class Fetch {
  public fileName: string;
  protected rawData: any;

  /**
   * Create a fetcher.
   * @param {string} fileName - Store base name of remote file.
   * @const {any} rawData - row data downloaded from remote website
   */

  constructor() {
    this.fileName = null;
    this.rawData = null;
  }

  /**
   * Test remote address and save fetched data
   * @return {void}
   */

  async download() {
    const response: any = await axios({
      url: REMOTE_DATA_SOURCE_URL,
      method: "get",
      responseType: "stream",
    });

    if (response.status == "200") {
      this.fileName = path.basename(response.request.path);
      await response.data.pipe(
        fs.createWriteStream(`${LOCAL_FILES_PATHS.input}${this.fileName}`)
      );
    } else {
      throw new Error("Connection failed");
    }
  }
}

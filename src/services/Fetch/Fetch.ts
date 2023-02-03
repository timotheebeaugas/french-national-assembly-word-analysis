import axios from "axios";
import {
  LOCAL_FILES_PATHS,
  REMOTE_DATA_SOURCE_URL,
} from "../../../utils/constants.js";
import * as fs from "fs";
import * as path from "path";

export class Fetch {
    public fileName: string;
    protected remoteAdress: string;
    protected rawData: any;

  /**
   * Create a fetcher.
   * @param {string} fileName - Store base name of remote file.
   * @const {string} remoteAdress - remote https adress stored in constant.ts file
   * @const {any} rawData - row data downloaded from remote website
   */

  constructor() {
    this.fileName = null;
    this.remoteAdress = REMOTE_DATA_SOURCE_URL;
    this.rawData = null;
  }

  error(message: string): never {
    throw new Error(message);
  }

  /** 
   * Test remote address and save fetched data
   * @return {void} 
   */

  async download() {
    try {
      const response: any = await axios({
        url: REMOTE_DATA_SOURCE_URL,
        method: "get",
        responseType: "stream",
      });
      if (response.status == "200") {
        this.fileName = path.basename(response.request.path);
        response.data.pipe(
          fs.createWriteStream(LOCAL_FILES_PATHS.input + this.fileName)
        ); 
      } else {
        this.error("Connection failed");
      }
    } catch (error) {
      this.error(error);
    }
  }
}

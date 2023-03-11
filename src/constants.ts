import { Object } from "../utils/Types"

/** Path for read and save data
  *  @constant LOCAL_FILES_PATHS
  *  @type {string}
  *  @default
*/

export const LOCAL_FILES_PATHS: Object = {
  input: "./tmp/",
  output: "./tmp/",
};

/** App interval execution
  *  @constant FETCH_URL_INTERVAL
  *  @type {string}
  *  @default
*/

export const FETCH_URL_INTERVAL: string = "0 0 * * *";

export const REMOTE_DATA_SOURCE_URL: string = "https://www.assemblee-nationale.fr/dyn/opendata/CRSANR5L16S2023O1N130.xml"



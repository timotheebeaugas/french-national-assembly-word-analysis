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

/** URL of National Assembly's data
  *  @constant REMOTE_DATA_SOURCE_URL
  *  @type {string}
  *  @default
*/

export const REMOTE_DATA_SOURCE_URL: string = "https://assemblee-nationale.fr/"


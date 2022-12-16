import { Object } from "./Types"

export const SOURCE_FILE_URL: string | undefined = process.env.SOURCE_FILE_URL;

export const LOCAL_FILES_PATHS: Object = {
  input: "./tmp/",
  output: "./tmp/",
};

export const FETCH_URL_INTERVAL: string | undefined = "0 0 * * *";


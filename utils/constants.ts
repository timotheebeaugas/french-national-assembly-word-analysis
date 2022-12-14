type Object = {
  [key: string]: string | undefined;
};

export const SOURCE_FILE_URL: string | undefined = process.env.SOURCE_FILE_URL;

export const LOCALFILES_PATHS: Object = {
  input: process.env.INPUT,
  output: process.env.OUTPUT,
};

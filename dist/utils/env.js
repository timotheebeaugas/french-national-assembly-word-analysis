import * as dotenv from 'dotenv';
dotenv.config({ path: '.././config/.env' });
export const SOURCE_FILE_URL = process.env.SOURCE_FILE_URL;
export const LOCAL_FILES_PATHS = {
    input: process.env.LOCAL_INPUT,
    output: process.env.LOCAL_OUTPUT,
};

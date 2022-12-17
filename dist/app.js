import * as dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper("publicDebateReports.zip");
console.log(test.unzipOneFile());
console.log(test);

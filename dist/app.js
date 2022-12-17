import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper();
test.unzipOneFile("publicDebateReports.zip");

import * as dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import { ParserXML } from "./src/services/Parser/ParserXML.js";
const test = new ParserXML("unzippedPublicDebateReports");
test.readFile();
test.parse();
test.saveData();
console.log(test.parsedData);

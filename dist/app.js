import { ParserXML } from "./src/services/Parser/ParserXML.js";
const test = new ParserXML("unzippedPublicDebateReports");
test.readFile();
test.parse();
test.saveData();

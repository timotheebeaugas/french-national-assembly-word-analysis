import { ParserXML } from "./src/services/Parser/ParserXML.js";
const test = new ParserXML("unzippedPublicDebateReports");
test.parse();
console.log(test._parsedData);

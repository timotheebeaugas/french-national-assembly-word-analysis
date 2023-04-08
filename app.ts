
// DOWNLOAD DATA
/* import { Fetch } from "./src/services/Fetch/Fetch.js";

const report = new Fetch("https://www.assemblee-nationale.fr/dyn/opendata/CRSANR5L16S2023O1N205.xml");

report.download();   */

import { ParserXML } from "./src/services/Parser/ParserXML.js";

const report = new ParserXML("CRSANR5L16S2023O1N205");

report.parse()
console.log(report)

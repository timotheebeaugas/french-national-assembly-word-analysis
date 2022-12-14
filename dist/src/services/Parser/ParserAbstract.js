import * as fs from "fs";
export class ParserAbstract {
    constructor(fileName) {
        this.fileName = fileName;
        this.rawdata = null;
        this.parsedMetaData = null;
    }
    error(message) {
        throw new Error(message);
    }
    readFile() {
        try {
            const data = fs.readFileSync(process.env.LOCAL_INPUT + this.fileName + this.fileType, { encoding: "utf8", flag: "r" });
            this.rawdata = data;
        }
        catch (_a) {
            this.error("cannot read this file");
        }
    }
    saveData() {
        const data = this.parsedData;
        if (data) {
            this.parsedMetaData = data.compteRendu.metadonnees;
            this.parsedContentData = data.compteRendu.contenu;
            try {
            }
            catch (_a) {
                this.error("cannot find parsed data");
            }
        }
        else {
            this.error("no past data to process");
        }
    }
}

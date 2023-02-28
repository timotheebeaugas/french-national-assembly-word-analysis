var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { LOCAL_FILES_PATHS, REMOTE_DATA_SOURCE_URL, } from "../../../utils/constants.js";
import * as fs from "fs";
import * as path from "path";
export class Fetch {
    constructor() {
        this.fileName = null;
        this.remoteAdress = REMOTE_DATA_SOURCE_URL;
        this.rawData = null;
    }
    error(message) {
        throw new Error(message);
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios({
                    url: REMOTE_DATA_SOURCE_URL,
                    method: "get",
                    responseType: "stream",
                });
                if (response.status == "200") {
                    this.fileName = path.basename(response.request.path);
                    response.data.pipe(fs.createWriteStream(LOCAL_FILES_PATHS.input + this.fileName));
                }
                else {
                    this.error("Connection failed");
                }
            }
            catch (error) {
                this.error(error);
            }
        });
    }
}

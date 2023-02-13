/** First of all.
 * Import configuration files. 
*/

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({path: './config/.env'})

import { Unzipper } from "./src/services/Unzipper/Unzip.js";
const test = new Unzipper()

test.unzipOneFile("publicDebateReports.zip")

import "reflect-metadata";
import { DataSource } from "typeorm"

import { Report } from "./entities/Report.js"
import { Speech } from "./entities/Speech.js"
import { AgendaItem } from "./entities/AgendaItem.js"
import { Actor } from "./entities/Actor.js"
import { Mandate } from './entities/Mandate.js';
import { PoliticalBody } from './entities/PoliticalBody.js';
import { Constituency } from './entities/Constituency.js';

import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities:  [ Mandate, AgendaItem, Actor, Speech, Report, PoliticalBody, Constituency], // entities: ["entity/*.js"] = DON'T WORK
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Migration done.");
    })
    .catch((error) => console.log(error))
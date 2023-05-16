import "reflect-metadata";
import * as dotenv from 'dotenv';

import { DataSource } from "typeorm"
import { Report } from "../../models/entities/Report.entity.js";
import { Mandate } from "../../models/entities/Mandate.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { PoliticalBody } from "../../models/entities/PoliticalBody.entity.js";
import { Constituency } from "../../models/entities/Constituency.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";


dotenv.config(); 

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: [ Mandate, AgendaItem, Actor, Speech, Report, PoliticalBody, Constituency], // [`../../models/entities/*.entity.{js,ts}`] don't works
  synchronize: true,
  logging: false,
}); 

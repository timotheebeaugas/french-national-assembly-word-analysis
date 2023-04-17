import "reflect-metadata";
import { DataSource } from "typeorm"
import { Report } from "../../models/entities/Report.entity.js";
import * as dotenv from 'dotenv';
dotenv.config(); 

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: [`../../models/entities/*.entity.{js,ts}`], 
  synchronize: true,
  logging: true,
});
 

import "reflect-metadata"
import { DataSource } from "typeorm"
import { Report } from "./entities/Report.js"
import { Speech } from "./entities/Speech.js"
import { AgendaItem } from "./entities/AgendaItem.js"
import { Actor } from "./entities/Actor.js"
import { Mandate } from './entities/Mandate.js';
import { PoliticalBody } from './entities/PoliticalBody.js';
import { Constituency } from './entities/Constituency.js';

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "abcd",
    database: "postgres",
    schema: 'public',
    entities: [ Mandate, AgendaItem, Actor, Speech, Report, PoliticalBody, Constituency],
    synchronize: true,
    logging: false,
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))
import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  /**
   * @const data - save report data for easier access inside methods
   * @const reportId - local variable to save current report id
   * @const agendaItemId - local variable to save current agendaItem id
   */
  protected reportId: null | number = null;
  protected agendaItemId: null | number = null;

  /**
   * Create a parser.
   * @constructor
   * @param data - parsed raw datas.
   */
  constructor(readonly data: any) {
    this.data = data.compteRendu;
    AppDataSource.initialize();
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content actor name and id
   * @return {Promise<number>} actor's id.
   */
  async createActor(paragraph: any): Promise<number> {
    const actor = new Actor();
    (actor.externalId = paragraph.orateurs.orateur.id),
      (actor.name = paragraph.orateurs.orateur.nom);
    await AppDataSource.manager.save(actor);
    return actor.id;
  }

  /**
   * Create a new report in database.
   * @return {Promise<number>} report's id.
   */
  async createReport(): Promise<number> {
    const report = new Report();
    report.sourceURL = `https://www.assemblee-nationale.fr/dyn/opendata/${this.data.uid}.xml`;
    report.externalId = this.data.uid;
    report.legislature = this.data.metadonnees.legislature;
    report.date = this.data.metadonnees.dateSeanceJour;
    report.daySessionNumber = this.data.metadonnees.numSeanceJour;
    report.presidency = this.data.metadonnees.sommaire.presidentSeance;
    await AppDataSource.manager.save(report);
    return report.id;
  }

  /**
   * Create a new agenda item in database.
   * @return {Promise<number>} item's id.
   */
  async createAgendaItems(): Promise<number> {
    const item = new AgendaItem();
    item.externalId = this.data.uid;
    item.report = this.reportId;
    item.title =
      this.data.metadonnees.sommaire.sommaire1[0].titreStruct.intitule;
    await AppDataSource.manager.save(item);
    return item.id;
  }

  /**
   * Create a new actor in database.
   * @param {any} paragraph - The 'paragraph' object that content text and actor's data
   * @return {Promise<number>} speech's id.
   */
  async createSpeeches(paragraph: any): Promise<number> {
    const speech = new Speech();
    speech.externalId = paragraph.content.paragraphe["@_id_syceron"];
    speech.report = this.reportId;
    speech.agendaItem = this.agendaItemId;
    speech.actor = paragraph.orateurs.orateur.id;
    speech.content = paragraph.texte;
    await AppDataSource.manager.save(speech);
    return speech.id;
  }

  /**
   * Read one paragraph and check if is it necessary to create a new actor and a new speech in database.
   * @param {any} paragraph - One 'paragraph' object that content text and actor data
   * @return {Promise<void>} return nothing.
   */
  async readParagraph(paragraph: any): Promise<void> {
    await AppDataSource.initialize();

    const actorRepository = AppDataSource.getRepository(Actor);
    const findActors = await actorRepository.findOneBy({
      externalId: paragraph.orateurs.orateur.id,
    });
    if (findActors == null) {
      await this.createActor(paragraph);
    }

    const speechRepository = AppDataSource.getRepository(Speech);
    const findSpeeches = await speechRepository.findOneBy({
      externalId: paragraph.content.paragraphe["@_id_syceron"],
    });

    if (findSpeeches == null) {
      await this.createSpeeches(paragraph);
    }
  }

  /**
   * Find all 'paragraph' objects and triggered the method 'read Values' on each one.
   * @return {Promise<void>} return nothing.
   */
  readValues(value: any): void {
    for (const property in value) {
      if (property === "paragraphe") {
        //console.log(value[property]);
      } else if (typeof value[property] === "object") {
        console.log("i");
        this.readValues(value[property]);
      }
    }
  }

  /**
   * Main method for trigger the other methods.
   * @return {Promise<Object>} returns new entries.
   */
  async Read(): Promise<Object> {
    try {
      await AppDataSource.initialize();

      const reportRepository = AppDataSource.getRepository(Report);
      const findReports = await reportRepository.findOneBy({
        externalId: this.data.uid,
      });

      const agendaRepository = AppDataSource.getRepository(AgendaItem);
      const findAgendas = await agendaRepository.findBy({
        externalId: this.data.uid,
      });

      if (findReports == null) {
        console.log(findReports);
        this.reportId = await this.createReport();
      } else {
        this.reportId = findReports.id;
      }
      if (findAgendas.length == null) {
        this.agendaItemId = await this.createAgendaItems();
      }

      this.readValues(this.data.contenu);

      return 0;
    } catch (error) {
      return error;
    }
  }
}

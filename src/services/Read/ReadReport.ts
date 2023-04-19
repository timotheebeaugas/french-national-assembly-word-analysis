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
   * @param data - parsed raw datas.
   */
  constructor(readonly data: any) {
    this.data = data.compteRendu;
    AppDataSource.initialize();
  }

  async createActor(paragraph: any) {
    const actor = new Actor();
    (actor.externalId = paragraph.orateurs.orateur.id),
      (actor.name = paragraph.orateurs.orateur.nom);
    await AppDataSource.manager.save(actor);
    return actor.id;
  }

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

  async createAgendaItems(): Promise<number> {
    const item = new AgendaItem();
    item.externalId = this.data.uid;
    item.report = this.reportId;
    item.title =
      this.data.metadonnees.sommaire.sommaire1[0].titreStruct.intitule;
    await AppDataSource.manager.save(item);
    return item.id;
  }

  async createSpeeches(actorId: number, paragraph: any) {
    const speech = new Speech();
    speech.externalId = paragraph.content.paragraphe["@_id_syceron"];
    speech.report = this.reportId;
    speech.agendaItem = this.agendaItemId;
    speech.actor = actorId;
    speech.content = paragraph.texte;
    await AppDataSource.manager.save(speech);
    return speech.id;
  }

  async readParagraph(paragraph: any) {
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
      await this.createSpeeches(findActors.id, paragraph);
    }
  }

  readValues(value: any): void {
    for (const property in value) {
      if (typeof value[property] === "object") {
        for (const prop in value[property]) {
          this.readValues(value[property][prop]);
        }
      } else if (typeof value[property] === "string"){
        console.log(property);
      }
      else {
        if (property === "paragraphe") console.log(property);
      }
    }
  }

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

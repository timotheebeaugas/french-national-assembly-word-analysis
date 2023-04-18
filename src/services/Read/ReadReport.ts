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
  }

  createActor() {// select paragraph
    const actor = new Actor();
    actor.externalId = null,
    actor.name = null;
    actor.externalId = this.data.contenu.id;
    actor.externalId = this.data.contenu.id;
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
    item.title = this.data.metadonnees.sommaire.sommaire1[0].titreStruct.intitule;
    await AppDataSource.manager.save(item);
    return item.id;
  } 

  async createSpeeches(actorId: number) {
    const speech = new Speech();
    speech.externalId = this.data.uid;
    speech.report = this.reportId;
    speech.agendaItem = this.agendaItemId;
    speech.actor = actorId;
    speech.content = "";
    await AppDataSource.manager.save(speech);
    return speech.id;
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
        console.log(findReports)
        this.reportId = await this.createReport();
      } else { 
        this.reportId = findReports.id;
      }
      if (findAgendas.length == 0) {
        this.agendaItemId = await this.createAgendaItems();
      }

      return 0;
    } catch (error) {
      return error;
    }
  }
}

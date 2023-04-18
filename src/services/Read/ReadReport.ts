import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";
import { AgendaItem } from "../../models/entities/AgendaItem.entity.js";
import { Actor } from "../../models/entities/Actor.entity.js";
import { Speech } from "../../models/entities/Speech.entity.js";

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {

  /**
   * @const rawdata - local variable for store database report id 
   */
  protected reportId: null | number = null;

  /**
   * Create a parser.
   * @param data - parsed raw datas.
   */
  constructor(readonly data: any) {}

  createActor() {}

  async createReport(data: any): Promise<number> {
    const report = new Report();
    report.sourceURL = `https://www.assemblee-nationale.fr/dyn/opendata/${data.uid}.xml`;
    report.externalId = data.uid;
    report.legislature = data.metadonnees.legislature;
    report.date = data.metadonnees.dateSeanceJour;
    report.daySessionNumber = data.metadonnees.numSeanceJour;
    report.presidency = data.metadonnees.sommaire.presidentSeance;
    await AppDataSource.manager.save(report);
    return report.id;
  }

  async createAgendaItems(data: any, newReportId: number): Promise<number> {
    const item = new AgendaItem();
    item.externalId = data.uid;
    item.report = newReportId;
    item.title = data.metadonnees.sommaire.sommaire1[0].titreStruct.intitule;
    await AppDataSource.manager.save(item);
    return item.id;
  } 

  createSpeeches() {}

  async Read(): Promise<Object> {
    const data = this.data.compteRendu;
    try {
      await AppDataSource.initialize();

      const reportRepository = AppDataSource.getRepository(Report);
      const findReports = await reportRepository.findOneBy({
        externalId: data.uid,
      });

      const agendaRepository = AppDataSource.getRepository(AgendaItem);
      const findAgendas = await agendaRepository.findBy({
        externalId: data.uid,
      });

      if (findReports == null) { 
        console.log(findReports)
        this.reportId = await this.createReport(data);
      } else { 
        this.reportId = findReports.id;
      }
      if (findAgendas.length == 0) {
        this.createAgendaItems(data, this.reportId);
      }

      return 0;
    } catch (error) {
      return error;
    }
    return {};
  }
}

import { AppDataSource } from "../Database/Connection.js";
import { Report } from "../../models/entities/Report.entity.js";

/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
  createActor() {}

  createReport() {}

  createAgendaItems() {}

  createSpeeches() {}

  /**
   * @param data - parsed raw datas
   */

  async Read(data: any): Promise<Object> {
    console.log(data.compteRendu.uid);
    try{
      await AppDataSource.initialize()
      const reportsRepository = AppDataSource.getRepository(Report);
      const findReports = await reportsRepository.find();// WHERE
      if(findReports.length == 0){
        const report = new Report();
        report.sourceURL = `https://www.assemblee-nationale.fr/dyn/opendata/${data.compteRendu.uid}.xml`
        report.externalId = data.compteRendu.uid;
        report.legislature = data.compteRendu.metadonnees.legislature;
        report.date = data.compteRendu.metadonnees.dateSeanceJour;
        report.daySessionNumber = data.compteRendu.metadonnees.numSeanceJour;
        report.presidency = data.compteRendu.metadonnees.sommaire.presidentSeance;
        await AppDataSource.manager.save(report)
        console.log(report.id);
      }else{
        console.log("dejà un report");
      }
    }catch(error){
      console.log(error)
    }

    // check if report exist and agenda item (because all of them are related)
    //if not create him
    // if yes, pass

    // check if speech exist
    // if not exist, create him
    //check if actor exist
    //if not create him
    // else, next

    // return array with new entries ref for future select
    return {};
  }
}

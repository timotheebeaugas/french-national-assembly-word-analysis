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

  async Read(data: Object): Promise<Object> {
    console.log(Report);
    try{
      await AppDataSource.initialize()
/*       const reportsRepository = AppDataSource.getRepository(Report);
      const findReports = await reportsRepository.find();
      console.log("All photos from the db: ", findReports); */
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

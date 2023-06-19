import { AppDataSource } from '../../services/Database/Connection.js';
import { Report as ReportEntity } from '../entities/Report.entity.js';

const reportRepository = AppDataSource.getRepository(ReportEntity);

export async function insert(payload: Partial<ReportEntity>) {
  return reportRepository.insert(payload);
}

export async function findByExternalId(externalId: string) {
  return reportRepository.findOneBy({ externalId });
}

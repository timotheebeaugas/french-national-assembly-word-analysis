import { AppDataSource } from '../../services/Database/Connection.js';
import { Speech as SpeechEntity } from '../entities/Speech.entity.js';

const speechRepository = AppDataSource.getRepository(SpeechEntity);

export async function insert(payload: Partial<SpeechEntity>) {
  return speechRepository.insert(payload);
}

export async function findByExternalId(externalId: string) {
  return speechRepository.findOneBy({ externalId });
}

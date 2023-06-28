import { AppDataSource } from '../../services/Database/Connection.js';
import { Actor as ActorEntity } from '../entities/Actor.entity.js';

const actorRepository = AppDataSource.getRepository(ActorEntity);

export async function insert(payload: Partial<ActorEntity>) {
  return actorRepository.insert(payload);
}

export async function findByExternalId(externalId: string) {
  return actorRepository.findOneBy({ externalId });
}

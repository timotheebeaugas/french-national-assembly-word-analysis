import { Actor } from '../../models/entities/Actor.entity.js';
import { ActorManager } from '../../models/managers/index.js';

type actorCreationPayloadType = {
  externalId: string,
  name: string,
}

async function createOne(rawActor: actorCreationPayloadType) {
  const {
    externalId,
    name,
  } = rawActor;

  const actor = new Actor();

  actor.externalId = externalId;
  actor.name = name;   

  await ActorManager.insert(actor);   

  return ActorManager.findByExternalId(externalId);
}

export default createOne;

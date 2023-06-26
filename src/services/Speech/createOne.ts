import { Speech } from '../../models/entities/Speech.entity.js';
import { SpeechManager } from '../../models/managers/index.js';

type speechCreationPayloadType = {
  externalId: string,
  reportId: number,
  actorId: number,
  content: string,
}

async function createOne(rawSpeech: speechCreationPayloadType) {
  const {
    externalId,
    reportId,
    actorId,
    content,
  } = rawSpeech;

  const speech = new Speech();

  speech.externalId = externalId;
  speech.reportId = reportId;
  speech.actorId = actorId;
  speech.content = content;

  await SpeechManager.insert(speech);

  return SpeechManager.findByExternalId(externalId);
}

export default createOne;

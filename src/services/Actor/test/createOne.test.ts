
import * as assert from "assert";
import * as sinon from "sinon";

import createOne from "../createOne.js";

import { ActorManager } from '../../../models/managers/index.js';

import { Actor } from "../../../models/entities/Actor.entity.js";

const Aurore = new Actor();

Aurore.externalId = "0983048034";
Aurore.name = "Aurore Bergé";


beforeEach(()=>{
  let insertActorStub = sinon.stub(ActorManager, "insert");
  insertActorStub.resolves(null);
  let findByExternalIdActorStub = sinon.stub(ActorManager, "findByExternalId");
  findByExternalIdActorStub.resolves(Aurore);
})


describe('services', function () {
  describe('Actor', function () {
    describe('createOne', function () {
      it('should create actor in database', async function () {
        const fakeObject = {
          externalId: "0983048034",
          name: "Aurore Bergé",
        }
        let res = await createOne(fakeObject);
        assert.equal(res, Aurore)
      });
    });
  });
});

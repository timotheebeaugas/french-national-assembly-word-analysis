const assert = require('assert'); 

describe('services', function () {
  describe('Actor', function () {
    describe('createOne', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });
});

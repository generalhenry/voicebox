var util = require('util');

describe('songs', function () {
  describe('none', function () {
    it('should return an object with an array of songs', function (done) {
      songs(function (error, result) {
        
      });
    });
  });
});
  songs(console.log);
  songs({by:'popularity'},console.log);
  songs({query:'bowie'},console.log);
  songs(11750, console.log);
  songs([11750,57181],console.log);
  songs('languages', console.log);
  songs('stats', console.log);
}
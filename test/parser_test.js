var assert = require('assert');
var parser = require('../parser');

const TEXT = `
00:40 Hello World
12:23 This is not the end
Something else in the middle
1:23:11 Not the last song
`;

describe('Parser', function() {
  describe('parser', function() {
    it('should find all timestamps', function() {
      console.log(parser.parse(TEXT));
      assert.equal(parser.parse(TEXT).length, 3);
    });
  });
});

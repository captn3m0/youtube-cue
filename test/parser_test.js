/*jshint esversion: 6 */
var assert = require('assert');
var parser = require('../parser');

const TEXT = `
00:40 The Coders - Hello World
12:23 This is not the end
Something else in the middle
1:23:11 Not the last song
`;

const TEXT_WITH_ARTIST = '12:23 Rolling Stones - Hello World';

describe('Parser', function() {
  describe('parser', function() {
    it('should find all timestamps', function() {
      assert.equal(parser.parse(TEXT).length, 3);
    });

    it('should find artist names', function() {
      let result = parser.parse(TEXT_WITH_ARTIST);
      assert.equal(result[0].artist, 'Rolling Stones');
    });
  });
});

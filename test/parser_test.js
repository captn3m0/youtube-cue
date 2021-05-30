/*jshint esversion: 6 */
var assert = require('assert');
var parser = require('../src/parser');

const TEXT = `
00:40 The Coders - Hello World
12:23 This is not the end
Something else in the middle
1:23:11 Not the last song
01.   Screens     0:00 - 5:40
02.   Inharmonious Slog     5:40 - 10:11
03.   The Everyday Push     10:11 - 15:46
04.   Storm     15:46 - 19:07
05.   Outre Lux     19:07 - 23:11
06.   Balsam Massacre     23:11 - 26:24
07.   Eco Friend     26:24 - 32:15
08.   Off-Piste     32:15 - 36:53
09.   Aura     36:53 - 41:44
10.   Bombogenesis     41:44 - 48:20
`;

const TEXT_WITH_ARTIST = '12:23 Rolling Stones - Hello World';

describe('Parser', function() {
  describe('parser', function() {
    var big_result;
    before(function() {
      big_result = parser.parse(TEXT)
    });
    it('should find all timestamps', function() {
      assert.equal(big_result.length, 13);
    });

    it('should find artist names', function() {
      let result = parser.parse(TEXT_WITH_ARTIST);
      assert.equal(result[0].artist, 'Rolling Stones');
    });

    it('should find track numbers', function() {
      assert.equal(big_result[3].track, 1)
      assert.equal(big_result[4].track, 2)
      assert.equal(big_result[5].track, 3)
      assert.equal(big_result[6].track, 4)
      assert.equal(big_result[7].track, 5)
      assert.equal(big_result[8].track, 6)
      assert.equal(big_result[9].track, 7)
      assert.equal(big_result[10].track, 8)
      assert.equal(big_result[11].track, 9)
      assert.equal(big_result[12].track, 10)
    })
  });
});

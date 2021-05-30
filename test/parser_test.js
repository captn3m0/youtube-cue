/*jshint esversion: 6 */
import { strict as assert } from 'assert';

import {parse} from '../src/parser.js'

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
Hello World 48:20
50:23 Bye World
`;

const TEXT_WITH_ARTIST = '12:23 Rolling Stones - Hello World';

describe('Parser', function() {
  var big_result;
  before(function() {
    big_result = parse(TEXT)
  });
  it('should find all timestamps', function() {
    assert.equal(big_result.length, 15);
  });

  it('should find artist names', function() {
    let result = parse(TEXT_WITH_ARTIST);
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

  it('should ensure ending timestamps for all', function() {
    assert.deepEqual(big_result[13].end, {calc: 3023, hh:0, mm:50, ss:23, ts: '50:23'})
    // TODO
    assert.deepEqual(big_result[14].end, null)
  })

  it('should parse taylor swift', function() {
    let result = parse(`0:00 the 1
    3:29 cardigan
    9:30 the last great american dynasty
    11:56 exile
    16:46 my tears ricochet
    21:03 mirrorball
    24:35 seven
    28:07 august
    32:30 this is me trying
    35:52 illicit affairs
    39:05 invisible strings
    43:22 mad woman
    49:30 epiphany
    52:17 betty
    57:15 peace
    1:01:10 hoax
    1:04:50 the lakes`)
    console.log(result)
  })
});

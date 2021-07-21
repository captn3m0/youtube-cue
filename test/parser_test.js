/*jshint esversion: 6 */
import { strict as assert } from "assert";

import { parse } from "../src/parser.js";

const TEXT = `
00:40 The Coders - Hello World
1:00 This is not the end
Something else in the middle
1:23 Not the last song
01.   Screens     1:40 - 5:40
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

const TEXT_WITH_ARTIST = "12:23 Rolling Stones - Hello World";

describe("Parser", function() {
  var big_result;
  before(function() {
    big_result = parse(TEXT);
  });
  it("should find all timestamps", function() {
    assert.equal(big_result.length, 15);
  });

  it("should find artist names", function() {
    let result = parse(TEXT_WITH_ARTIST);
    assert.equal(result[0].artist, "Rolling Stones");
  });

  it("should find track numbers", function() {
    assert.equal(big_result[3].track, 1);
    assert.equal(big_result[4].track, 2);
    assert.equal(big_result[5].track, 3);
    assert.equal(big_result[6].track, 4);
    assert.equal(big_result[7].track, 5);
    assert.equal(big_result[8].track, 6);
    assert.equal(big_result[9].track, 7);
    assert.equal(big_result[10].track, 8);
    assert.equal(big_result[11].track, 9);
    assert.equal(big_result[12].track, 10);
  });

  it("should ensure ending timestamps for all", function() {
    assert.deepEqual(big_result[13].end, {
      calc: 3023,
      hh: 0,
      mm: 50,
      ss: 23,
      ts: "00:50:23",
    });
    // TODO
    assert.deepEqual(big_result[14].end, null);
  });

  it("should parse timestamps with square brackets", function() {
    let result = parse(`[00:00:00] 1. Steve Kroeger x Skye Holland - Through The Dark
      [00:02:53] 2. Gabri Ponte x Jerome - Lonely `)
    assert.deepEqual(result[0], {
        artist: "Steve Kroeger x Skye Holland",
        title: "Through The Dark",
        track: 1,
        start: { ts: "00:00:00", hh: 0, mm: 0, ss: 0, calc: 0 },
        end: { ts: "00:02:53", hh: 0, mm: 2, ss: 53, calc: 173 },
        _: { left_text: "", right_text: "Steve Kroeger x Skye Holland - Through The Dark" },
      })
  });

  it("should parse durations when given", function() {
    let result = parse(`1. Artist - Title 6:19
2. Another Artist - Another Title 6:59
3. Yet Another Artist - Yet another title 5:12`)
    assert.deepEqual(result[0], {
        artist: "Artist",
        title: "Title",
        track: 1,
        start: { ts: "00:00:00", hh: 0, mm: 0, ss: 0, calc: 0 },
        end: { ts: "00:06:19", hh: 0, mm: 6, ss: 19, calc: 379 },
        _: { left_text: "Artist - Title", right_text: "" },
      })

    assert.deepEqual(result[1], {
        artist: "Another Artist",
        title: "Another Title",
        track: 2,
        start: { ts: "00:06:19", hh: 0, mm: 6, ss: 19, calc: 379 },
        end: { ts: "00:13:18", hh: 0, mm: 13, ss: 18, calc: 798 },
        _: { left_text: "Another Artist - Another Title", right_text: "" },
      })
    assert.deepEqual(result[2], {
        artist: "Yet Another Artist",
        title: "Yet another title",
        track: 3,
        start: { ts: "00:13:18", hh: 0, mm: 13, ss: 18, calc: 798 },
        end: { ts: "00:18:30", hh: 0, mm: 18, ss: 30, calc: 1110 },
        _: { left_text: "Yet Another Artist - Yet another title", right_text: "" },
      })
  });

  it("should parse taylor swift", function() {
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
    1:04:50 the lakes`);

    assert.deepEqual(result, [
      {
        artist: "Unknown",
        title: "the 1",
        track: 1,
        start: { ts: "00:0:00", hh: 0, mm: 0, ss: 0, calc: 0 },
        end: { ts: "00:3:29", hh: 0, mm: 3, ss: 29, calc: 209 },
        _: { left_text: "", right_text: "the 1" },
      },
      {
        artist: "Unknown",
        title: "cardigan",
        track: 2,
        start: { ts: "00:3:29", hh: 0, mm: 3, ss: 29, calc: 209 },
        end: { ts: "00:9:30", hh: 0, mm: 9, ss: 30, calc: 570 },
        _: { left_text: "", right_text: "cardigan" },
      },
      {
        artist: "Unknown",
        title: "the last great american dynasty",
        track: 3,
        start: { ts: "00:9:30", hh: 0, mm: 9, ss: 30, calc: 570 },
        end: { ts: "00:11:56", hh: 0, mm: 11, ss: 56, calc: 716 },
        _: { left_text: "", right_text: "the last great american dynasty" },
      },
      {
        artist: "Unknown",
        title: "exile",
        track: 4,
        start: { ts: "00:11:56", hh: 0, mm: 11, ss: 56, calc: 716 },
        end: { ts: "00:16:46", hh: 0, mm: 16, ss: 46, calc: 1006 },
        _: { left_text: "", right_text: "exile" },
      },
      {
        artist: "Unknown",
        title: "my tears ricochet",
        track: 5,
        start: { ts: "00:16:46", hh: 0, mm: 16, ss: 46, calc: 1006 },
        end: { ts: "00:21:03", hh: 0, mm: 21, ss: 3, calc: 1263 },
        _: { left_text: "", right_text: "my tears ricochet" },
      },
      {
        artist: "Unknown",
        title: "mirrorball",
        track: 6,
        start: { ts: "00:21:03", hh: 0, mm: 21, ss: 3, calc: 1263 },
        end: { ts: "00:24:35", hh: 0, mm: 24, ss: 35, calc: 1475 },
        _: { left_text: "", right_text: "mirrorball" },
      },
      {
        artist: "Unknown",
        title: "seven",
        track: 7,
        start: { ts: "00:24:35", hh: 0, mm: 24, ss: 35, calc: 1475 },
        end: { ts: "00:28:07", hh: 0, mm: 28, ss: 7, calc: 1687 },
        _: { left_text: "", right_text: "seven" },
      },
      {
        artist: "Unknown",
        title: "august",
        track: 8,
        start: { ts: "00:28:07", hh: 0, mm: 28, ss: 7, calc: 1687 },
        end: { ts: "00:32:30", hh: 0, mm: 32, ss: 30, calc: 1950 },
        _: { left_text: "", right_text: "august" },
      },
      {
        artist: "Unknown",
        title: "this is me trying",
        track: 9,
        start: { ts: "00:32:30", hh: 0, mm: 32, ss: 30, calc: 1950 },
        end: { ts: "00:35:52", hh: 0, mm: 35, ss: 52, calc: 2152 },
        _: { left_text: "", right_text: "this is me trying" },
      },
      {
        artist: "Unknown",
        title: "illicit affairs",
        track: 10,
        start: { ts: "00:35:52", hh: 0, mm: 35, ss: 52, calc: 2152 },
        end: { ts: "00:39:05", hh: 0, mm: 39, ss: 5, calc: 2345 },
        _: { left_text: "", right_text: "illicit affairs" },
      },
      {
        artist: "Unknown",
        title: "invisible strings",
        track: 11,
        start: { ts: "00:39:05", hh: 0, mm: 39, ss: 5, calc: 2345 },
        end: { ts: "00:43:22", hh: 0, mm: 43, ss: 22, calc: 2602 },
        _: { left_text: "", right_text: "invisible strings" },
      },
      {
        artist: "Unknown",
        title: "mad woman",
        track: 12,
        start: { ts: "00:43:22", hh: 0, mm: 43, ss: 22, calc: 2602 },
        end: { ts: "00:49:30", hh: 0, mm: 49, ss: 30, calc: 2970 },
        _: { left_text: "", right_text: "mad woman" },
      },
      {
        artist: "Unknown",
        title: "epiphany",
        track: 13,
        start: { ts: "00:49:30", hh: 0, mm: 49, ss: 30, calc: 2970 },
        end: { ts: "00:52:17", hh: 0, mm: 52, ss: 17, calc: 3137 },
        _: { left_text: "", right_text: "epiphany" },
      },
      {
        artist: "Unknown",
        title: "betty",
        track: 14,
        start: { ts: "00:52:17", hh: 0, mm: 52, ss: 17, calc: 3137 },
        end: { ts: "00:57:15", hh: 0, mm: 57, ss: 15, calc: 3435 },
        _: { left_text: "", right_text: "betty" },
      },
      {
        artist: "Unknown",
        title: "peace",
        track: 15,
        start: { ts: "00:57:15", hh: 0, mm: 57, ss: 15, calc: 3435 },
        end: { ts: "1:01:10", hh: 1, mm: 1, ss: 10, calc: 3670 },
        _: { left_text: "", right_text: "peace" },
      },
      {
        artist: "Unknown",
        title: "hoax",
        track: 16,
        start: { ts: "1:01:10", hh: 1, mm: 1, ss: 10, calc: 3670 },
        end: { ts: "1:04:50", hh: 1, mm: 4, ss: 50, calc: 3890 },
        _: { left_text: "", right_text: "hoax" },
      },
      {
        artist: "Unknown",
        title: "the lakes",
        track: 17,
        start: { ts: "1:04:50", hh: 1, mm: 4, ss: 50, calc: 3890 },
        end: null,
        _: { left_text: "", right_text: "the lakes" },
      },
    ]);
  });
});

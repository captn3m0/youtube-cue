/*jshint esversion: 6 */
import { strict as assert } from "assert";
import { generate } from "../src/cue.js";
import fs from "fs";

const DATA = {
  artist: "Dumbledore",
  album: "Curse of the Elder Wand",
  audioFile: "audio.m4a",
  tracks: [
    {
      artist: "Unknown",
      title: "the 1",
      track: 1,
      start: { ts: "00:00:00", hh: 0, mm: 0, ss: 0, calc: 0 },
      end: { ts: "00:3:9", hh: 0, mm: 3, ss: 9, calc: 189 },
      _: { left_text: "", right_text: "the 1" },
    },
    {
      artist: "Unknown",
      title: "cardigan",
      track: 2,
      start: { ts: "00:3:09", hh: 0, mm: 3, ss: 9, calc: 189 },
      end: { ts: "00:9:30", hh: 0, mm: 9, ss: 30, calc: 570 },
      _: { left_text: "", right_text: "cardigan" },
    },
  ],
};

describe("CUE", function () {
  it("should generate with leading zeroes", function () {
    generate(DATA, "/tmp/test.cue");
    const CUE_EXPECTED = `REM Generated using youtube-cue
PERFORMER "Dumbledore"
TITLE "Curse of the Elder Wand"
FILE "audio.m4a" M4A
  TRACK 1 AUDIO
    TITLE "the 1"
    PERFORMER "Unknown"
    INDEX 01 00:00:00
  TRACK 2 AUDIO
    TITLE "cardigan"
    PERFORMER "Unknown"
    INDEX 01 03:09:00
`;
    assert.equal(CUE_EXPECTED, fs.readFileSync("/tmp/test.cue", "utf-8"));
  });
});

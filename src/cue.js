import fs from "fs";

/** code to create a new CUE file, as per the standard
 * with a REM PERFORMER, TITLE, FILE attribute
 * and a list of tracks provided as input
 */

// https://en.wikipedia.org/wiki/Cue_sheet_(computing)
export function generate(data, outputFile) {
  try {
    fs.truncateSync(outputFile);
  } catch {}
  fs.appendFileSync(outputFile, `REM Generated using youtube-cue\n`);
  fs.appendFileSync(outputFile, `PERFORMER "${data.artist}"\n`);
  fs.appendFileSync(outputFile, `TITLE "${data.album}"\n`);
  fs.appendFileSync(outputFile, `FILE "${data.audioFile}" M4A\n`);
  for (var i in data.tracks) {
    let song = data.tracks[i];
    let minutes = String(song.start.hh * 60 + song.start.mm).padStart(2, "0");
    let seconds = String(song.start.ss).padStart(2, "0");
    fs.appendFileSync(outputFile, `  TRACK ${song.track} AUDIO\n`);
    fs.appendFileSync(outputFile, `    TITLE "${song.title}"\n`);
    fs.appendFileSync(outputFile, `    PERFORMER "${song.artist}"\n`);
    // Cue File is always MINUTES:SECONDS:FRAME, where FRAME is 00
    fs.appendFileSync(outputFile, `    INDEX 01 ${minutes}:${seconds}:00\n`);
  }
}

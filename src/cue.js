import fs from 'fs';

// https://en.wikipedia.org/wiki/Cue_sheet_(computing)
export function generate(data, outputFile) {
  try {
    fs.truncateSync(outputFile)
  } catch {}
  fs.appendFileSync(outputFile, `REM Generated using youtube-cue\n`);
  fs.appendFileSync(outputFile, `PERFORMER "${data.artist}"\n`);
  fs.appendFileSync(outputFile, `TITLE "${data.album}"\n`);
  fs.appendFileSync(outputFile, `FILE "${data.audioFile}" M4A\n`);
  for(var i in data.tracks) {
    let song = data.tracks[i];
    let minutes = (song.start.hh * 60) + (song.start.mm)
    fs.appendFileSync(outputFile, `  TRACK ${song.track} AUDIO\n`);
    fs.appendFileSync(outputFile, `    TITLE "${song.title}"\n`);
    fs.appendFileSync(outputFile, `    PERFORMER "${song.artist}"\n`);
    // Cue File is always MINUTES:SECONDS:FRAME, where FRAME is 00
    fs.appendFileSync(outputFile, `    INDEX 01 ${minutes}:${song.start.ss}:00\n`);
  }
}

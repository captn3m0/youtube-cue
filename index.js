#!/usr/bin/env node
import ytdl from 'ytdl-core';
import getArtistTitle from 'get-artist-title';
import { generate } from './src/cue.js';
import minimist from 'minimist';
import exit from 'process';
import updateNotifier from 'update-notifier';
import pkg from './src/package.js';
import { processFile, processYoutube } from './src/process.js';

updateNotifier({ pkg }).notify();

let argv = minimist(process.argv.slice(2), {
  string: ['audio-file', 'cue-title', 'cue-performer'],
});

if (argv.version) {
  console.log(pkg.version);
} else if (argv._.length < 1 || argv.help) {
  console.log(`Usage
    $ youtube-cue [--audio-file audio.m4a] --cue-title "Album Name" --cue-performer "Album Artist" <youtube_url|input_file> [output_file]

  youtube_url: Pass a Youtube URL from where description is fetched and parsed
  input_file: Pass a plaintext file which contains the description text containing a timesheet.

  Options
    --help, Show help
    --audio-file, Input Audio File (optional) that is written to the CUE sheet.

    If a youtube URL is passed, then
      The default audio file is set to %VIDEOTITLE.m4a
      The default output file is set to %VIDEOTITLE.cue
    Since video title is not available while parsing text files,
      The default audio file is set to audio.m4a
      The default output file is set to output.cue

    Generally the parser detects whether numbers (such as 00:12) are positional timestamps or track durations.
    To enforce a desired interpretation you can use these flags:

    --timestamps Parse as positional timestamps (relative to the start of the playlist)
    --durations Parse numbers as track durations instead.

    The above 2 are only needed to force behaviour in very specific edge cases, they should
    not be required for most files.

    --cue-title "Title that goes into the CUE file for the complete CUE sheet"
    --cue-performer "Performer for the entire collection. Commonly the album artist."

    cue-title and cue-performer are recommended especially if you are reading the data from a text file.

    --version Print version

  Examples
    $ youtube-cue --audio-file audio.m4a "https://www.youtube.com/watch?v=THzUassmQwE"
      "T A Y L O R  S W I F T – Folklore [Full album].cue" saved
    $ youtube-cue "https://youtu.be/THzUassmQwE" folklore.cue
      folklore.cue saved
    $ youtube-cue --audio-file audio.m4a --cue-performer "Magic Riders" description.txt
      "output.cue" saved`);
} else {
  let urlOrFile = argv._[0];

  if (fs.existsSync(urlOrFile)) {
    let r = processFile(urlOrFile, argv);
  } else {
    let r = processYoutube(urlOrFile, argv);
  }
  generate({ r.tracks, r.artist, r.audioFile, r.album }, r.outputFile);
  console.log(`"${outputFile}" saved`);
}

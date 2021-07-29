#!/usr/bin/env node
import ytdl from "ytdl-core";
import getArtistTitle from "get-artist-title";
import { parse } from "./src/parser.js";
import { generate } from "./src/cue.js";
import minimist from "minimist";
import exit from "process";
import updateNotifier from "update-notifier";
import pkg from "./src/package.js";

updateNotifier({ pkg }).notify();

let argv = minimist(process.argv.slice(2), {
  string: "audio-file",
});

if (argv.version) {
  console.log(pkg.version);
} else if (argv._.length < 1 || argv.help) {
  console.log(`Usage
    $ youtube-cue [--audio-file audio.m4a] <youtube_url> [output_file]

  Options
    --help, Show help
    --audio-file, Input Audio File (optional) that is written to the CUE sheet

    The default audio file is set to %VIDEOTITLE.m4a
    The default output file is set to %VIDEOTITLE.cue

    where $VIDEOTITLE is the title of the YouTube video.

    Generally the parser detects whether numbers are positional timestamps or track durations.
    To enforce a desired interpretation you can use these flags:

    --timestamps Parse as positional timestamps (relative to the start of the playlist)
    --durations Parse as track durations

    The above 2 are only needed to force behaviour in very specific edge cases, they should
    not be required for most files.

    --version Print version

  Examples
    $ youtube-cue --audio-file audio.m4a "https://www.youtube.com/watch?v=THzUassmQwE"
      "T A Y L O R  S W I F T – Folklore [Full album].cue" saved
    $ youtube-cue "https://youtu.be/THzUassmQwE" folklore.cue
      folklore.cue saved`);
} else {
  let url = argv._[0];

  ytdl.getInfo(url).then((info) => {
    let audioFile = argv["audio-file"]
      ? argv["audio-file"]
      : `${info.videoDetails.title}.m4a`;

    let output_file = argv._[1] ? argv._[1] : `${info.videoDetails.title}.cue`;

    let forceTimestamps = argv["timestamps"] ? argv["timestamps"] : false;

    let forceDurations = argv["durations"] ? argv["durations"] : false;

    if (forceTimestamps && forceDurations) {
      console.error("You can't pass both --timestamps and durations");
      exit(1);
    }

    let res = getArtistTitle(info.videoDetails.title, {
      defaultArtist: "Unknown Artist",
      defaultTitle: info.videoDetails.title,
    });
    let [artist, album] = res;
    artist = info.videoDetails.media ? info.videoDetails.media.artist : artist;
    let tracks = parse(info.videoDetails.description, {
      artist,
      forceTimestamps,
      forceDurations,
    });
    generate({ tracks, artist, audioFile, album }, output_file);
    console.log(`"${output_file}" saved`);
  });
}

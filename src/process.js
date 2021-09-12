import fs from 'fs';
import { parse } from './parser.js';

const DEFAULT_AUDIO_FILE = 'audio.m4a';
const DEFAULT_ARTIST = 'Unknown Artist';
const DEFAULT_ALBUM = 'Unknown Album';
const DEFAULT_OUTPUT_FILE = 'output.cue';

function validateArgs(argv) {
  if (forceTimestamps(argv) && forceDurations(argv)) {
    console.error("You can't pass both --timestamps and durations");
    exit(1);
  }
}

function forceTimestamps(argv) {
  return argv['timestamps'] ? argv['timestamps'] : false;
}

function forceDurations(argv) {
  argv['durations'] ? argv['durations'] : false;
}

export function processFile(inputFile, argv) {
  validateArgs(argv);
  let audioFile = argv['audio-file'] ? argv['audio-file'] : `audio.m4a`;
  let contents = fs.readFileSync(inputFile, 'utf8');
  let tracks = parse(contents, {
    artist: DEFAULT_ARTIST,
    forceTimestamps: forceTimestamps(argv),
    forceDurations: forceDurations(argv),
  });
  let artist = argv['cue-performer'] ? argv['cue-performer'] : DEFAULT_ARTIST;
  let album = argv['cue-title'] ? argv['cue-title'] : DEFAULT_ALBUM;
  return {
    tracks: tracks,
    artist: artist,
    audioFile: audioFile,
    album: album,
    outputFile: argv._[1] ? argv._[1] : DEFAULT_OUTPUT_FILE,
  };
}

export async function processYoutube(url, argv) {
  let info = await ytdl.getInfo(url);
  let audioFile = argv['audio-file']
    ? argv['audio-file']
    : `${info.videoDetails.title}.m4a`;
  let outputFile = argv._[1] ? argv._[1] : `${info.videoDetails.title}.cue`;

  let res = getArtistTitle(info.videoDetails.title, {
    defaultArtist: DEFAULT_ARTIST,
    defaultTitle: info.videoDetails.title,
  });

  let [artist, album] = res;
  artist = info.videoDetails.media ? info.videoDetails.media.artist : artist;

  let tracks = parse(info.videoDetails.description, {
    artist,
    forceTimestamps,
    forceDurations,
  });
  return {
    tracks: tracks,
    artist: artist,
    audioFile: audioFile,
    album: album,
    outputFile: argv._[1] ? argv._[1] : DEFAULT_OUTPUT_FILE,
  };
}

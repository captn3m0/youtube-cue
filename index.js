#!/usr/bin/env node
import ytdl from 'ytdl-core';
import getArtistTitle from 'get-artist-title'
import {parse} from './src/parser.js'
import {generate} from './src/cue.js'
import minimist from 'minimist'

let argv = minimist(process.argv.slice(2), {
  string: 'audio-file'
});

if (argv._.length <1 || argv.help ){
  console.log(`Usage
    $ youtube-cue [--audio-file audio.m4a] <youtube_url> [output_file]

  Options
    --help, Show help
    --audio-file, Input Audio File (optional) that is written to the CUE sheet

    The default audio file is set to %VIDEOTITLE.m4a
    The default output file is set to %VIDEOTITLE.cue

    where $VIDEOTITLE is the title of the YouTube video.

    --timestamps-only Do not try to parse the timestamps as track durations

  Examples
    $ youtube-cue --audio-file audio.m4a "https://www.youtube.com/watch?v=THzUassmQwE"
      "T A Y L O R  S W I F T – Folklore [Full album].cue" saved
    $ youtube-cue "https://youtu.be/THzUassmQwE" folklore.cue
      folklore.cue saved`)
} else {
  let url = argv._[0]

  ytdl.getInfo(url).then(info=>{
    let audioFile = argv['audio-file']? argv['audio-file'] : `${info.videoDetails.title}.m4a`

    let output_file = argv._[1]? argv._[1] : `${info.videoDetails.title}.cue`

    let timestampsOnly = argv['timestamps-only']? argv['timestamps-only'] : false;

    let res = getArtistTitle(info.videoDetails.title,{
      defaultArtist: "Unknown Artist",
      defaultTitle: info.videoDetails.title
    });
    let [artist, album] = res
    artist = (info.videoDetails.media ? info.videoDetails.media.artist : artist)
    let tracks = parse(info.videoDetails.description, {artist,timestampsOnly})
    generate({tracks, artist, audioFile, album}, output_file)
    console.log(`"${output_file}" saved`)
  })
}

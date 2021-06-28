#!/usr/bin/env node
import ytdl from 'ytdl-core';
import getArtistTitle from 'get-artist-title'
import {parse} from './src/parser.js'
import {generate} from './src/cue.js'
import minimist from 'minimist'

let argv = minimist(process.argv.slice(2), {
  string: 'audio-file'
});

if (argv._.length <2 || argv.help ){
  console.log(`Usage
    $ youtube-cue [--audio-file audio.m4a] <youtube_url> <output.cue>

  Options
    --help, Show help
    --audio-file, Input Audio File (optional)

  Examples
    $ youtube-cue --audio-file audio.m4a "https://www.youtube.com/watch?v=THzUassmQwE" output.cue
      output.cue saved
    $ youtube-cue "https://youtu.be/THzUassmQwE" folklore.cue
      folklore.cue saved`)
} else {
  let url = argv._[0]
  let output_file = argv._[1]

  ytdl.getInfo(url).then(info=>{
    let audioFile = argv['audio-file']? argv['audio-file'] : `${info.videoDetails.title}.m4a`
    let res = getArtistTitle(info.videoDetails.title,{
      defaultArtist: "Unknown Artist",
      defaultTitle: info.videoDetails.title
    });
    let [artist, album] = res
    artist = (info.videoDetails.media ? info.videoDetails.media.artist : artist)
    let tracks = parse(info.videoDetails.description, {artist})
    generate({tracks, artist, audioFile, album}, output_file)
  })
}

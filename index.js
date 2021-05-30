#!/usr/bin/env node
import meow from 'meow';
import ytdl from 'ytdl-core';
import getArtistTitle from 'get-artist-title'
import {parse} from './src/parser.js'
import {generate} from './src/cue.js'

const cli = meow(`
  Usage
    $ youtube-cue --audio-file <youtube_url> <output.cue>

  Options
    --help, Show help
    --version, Show version
    --audio-file, Input Audio File

  Examples
    $ youtube-cue "https://www.youtube.com/watch?v=THzUassmQwE" output.cue
      output.cue saved
`, {
  importMeta: import.meta,
  flags: {
    audioFile: {type: 'string'}
  },
  allowUnknownFlags: false
});

if(cli.input.length==2) {
  let url = cli.input[0]
  let output_file = cli.input[1]

  ytdl.getInfo(url).then(info=>{
    let audioFile = cli.flags.audioFile? cli.flags.audioFile : `${info.videoDetails.title}.m4a`
    let res = getArtistTitle(info.videoDetails.title,{
      defaultArtist: "Unknown Artist",
      defaultTitle: info.videoDetails.title
    });
    let [artist, album] = res
    artist = (info.videoDetails.media ? info.videoDetails.media.artist : artist)
    let tracks = parse(info.videoDetails.description, {artist})
    generate({tracks, artist, audioFile, album}, cli.input[1])
  })
} else {
  cli.showHelp()
}

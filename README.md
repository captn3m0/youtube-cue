# youtube-ripper

Helps you download music compilations from youtube.
Will automatically download the video, split it into chunks,
and apply proper id3v2 tags on all the files (including cover-art)

## Dependencies

- _Asssumes_ that `youtube-dl` and `ffmpeg` are available in `$PATH`
- Takes care of everything else

## Opinions

This software has opinions:

- You care about metadata and tagging your music properly
- All music must have cover art embedded
- You have `youtube-dl`  and `ffmpeg` already installed
- I am smart enough to parse youtube descriptions

## Installation

    npm install -g youtube-ripper

## Usage

    youtube-ripper "https://www.youtube.com/watch?v=41Y6xov0ppw"

## Configuration

- Pass a cue file instead of using the youtube description
- `--album-art` Pass custom album art image (Uses the youtube thumbnail by default)
- `--album-artist` Pass a specific Album Artist. (Picks up the artist from the video by default)
- `--genre` Pass a specific genre to use. (Picks up from the video by default)

## HACKING

- If this video does not work on a specific video, please attach the debug log output
- Pull Requests are welcome that add support for a better parser without breaking the existing tests
- Please add tests for any new functionality
- This project follows [Readme Driven Development][rdd], and as such the README may include "Forward Looking Statements"

## License

Licensed under the [MIT License][mit]

[mit]: https://nemo.mit-license.org/
[rdd]: http://tom.preston-werner.com/2010/08/23/readme-driven-development.html

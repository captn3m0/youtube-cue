# youtube-cue

Helps you tag music compilations from youtube by generating a Cue sheet. Use alongside [cuetag.sh](https://command-not-found.com/cuetag.sh), [m4acut](https://github.com/nu774/m4acut), or [mp3splt](https://sourceforge.net/p/mp3splt/) or any other Cue sheet tooling.

## Dependencies

- None

## Installation

    npm install -g youtube-cue

## Usage

    Generates Cue sheet from Youtube URL

    Usage
      $ youtube-cue --audio-file <youtube_url> <output.cue>

    Options
      --help, Show help
      --version, Show version
      --audio-file, Input Audio File

    Examples
      $ youtube-cue "https://www.youtube.com/watch?v=THzUassmQwE" output.cue
        output.cue saved

## Personal Usage

I have this in my `.bashrc` to download, split, tag, and import albums:

```shell
function ytdl.album() {
  cd $(mktemp -d)
  youtube-dl -f "bestaudio[ext=m4a]" --output "audio.m4a" "$1"
  youtube-cue --audio-file "audio.m4a" "$1" tracks.cue
  m4acut -C tracks.cue "audio.m4a" && \
  trash audio.m4a && \
  beet import -map .
}
```


## HACKING

- If this video does not work on a specific video, please attach the debug log output
- Pull Requests are welcome that add support for a better parser without breaking the existing tests
- Please add tests for any new functionality

## License

Licensed under the [MIT License][mit]

[mit]: https://nemo.mit-license.org/
[rdd]: http://tom.preston-werner.com/2010/08/23/readme-driven-development.html

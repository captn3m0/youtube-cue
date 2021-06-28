# youtube-cue

Generate CUE sheet from timestamps in youtube video description.

## What is this for?

1. If you have DJ-mix or album on YouTube that you'd like to generate a [CUE sheet][cue] for.
2. The video has timestamps in the video description.
3. The video is publicly available on Youtube.

`youtube-cue` will read the video description, get the timestamps and generate a [CUE sheet][cue] accordingly.

## Anti-features

1. It does not download tracks from YouTube
2. It does not split your tracks
3. It does not tag your tracks.

For all of the above, there are better tools available, such as [youtube-dl](https://ytdl-org.github.io/youtube-dl/), [m4acut](https://github.com/nu774/m4acut), [mp3splt](https://sourceforge.net/projects/mp3splt/), [cuetools](https://github.com/svend/cuetools), [beets](https://beets.io) and many more. youtube-cue tries to [do one thing well](https://onethingwell.org/).


## Installation

    npm install -g youtube-cue

## Upgrade

    npm update -g youtube-cue

## Usage

You need to pass 2 parameters, a Youtube URL and a output CUE filename. YouTube short URLs (`youtu.be`) are accepted. You can additionally pass a `audio-file` argument which is used for the [`FILE` specified in the CUE file][cuefile].

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

- If this video does not work on a specific video, please attach the complete output
- Pull Requests are welcome that add support for a better parser without breaking the existing tests
- Please add tests for any new functionality

## License

Licensed under the [MIT License][mit]

[mit]: https://nemo.mit-license.org/
[rdd]: http://tom.preston-werner.com/2010/08/23/readme-driven-development.html
[cue]: https://en.wikipedia.org/wiki/Cue_sheet_(computing)
[cuefile]: https://en.wikipedia.org/wiki/Cue_sheet_(computing)#Essential_commands

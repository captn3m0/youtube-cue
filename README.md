# youtube-cue

Helps you tag music compilations from youtube by generating a Cue sheet. Use alongside [cuetag.sh](https://command-not-found.com/cuetag.sh).

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

## HACKING

- If this video does not work on a specific video, please attach the debug log output
- Pull Requests are welcome that add support for a better parser without breaking the existing tests
- Please add tests for any new functionality

## License

Licensed under the [MIT License][mit]

[mit]: https://nemo.mit-license.org/
[rdd]: http://tom.preston-werner.com/2010/08/23/readme-driven-development.html

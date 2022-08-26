/*jshint esversion: 6 */
/**
 * https://regex101.com/r/XwBLUH/2
 * This regex parses out the following groups:
 * trackl track number at the left of the timestamp, optional and optionally enclosed in square brackets or parantheses
 * trackr track number at the  of the timestamp, optional and optionally enclosed in square brackets or parantheses
 *
 * start_ts: complete track start timestamp (hh:mm:ss) (mm:ss is minimum)
 * start_hh: starting hh, optional
 * start_mm: starting minutes, required
 * start_ss: starting seconds, required
 *
 * end_ts: complete track end timestamp (hh:mm:ss) (mm:ss is minimum to match). optional
 * end:hh: track end hour, optional
 * end:mm: track end minute, optional
 * end:ss: track end seconds, optional
 *
 * text_1: text found to the left of the timestamp, ignoring the track number
 * text_2: text found to the right of the timestamp, ignoring the track number
 *
 * It is suggested to check their lengths and pick one to parse as the Track Title
 */
const TS_REGEX =
  /^((?<trackl>\d{1,3})\.)? *(?<text_1>.*?) *[\(\[]?(?<start_ts>((?<start_hh>\d{1,2}):)?(?<start_mm>\d{1,2}):(?<start_ss>\d{1,2})) *-? *[\)\]]?(?<end_ts>(?<end_hh>\d{1,2}:)?(?<end_mm>\d{1,2}):(?<end_ss>\d{1,2}))? *((?<trackr>\d{1,3})\.)? *(?<text_2>.*?)$/;
import getArtistTitle from "get-artist-title";
var _options = {};

// Returns number of total seconds
function convertTime(h, m, s) {
  return +h * 60 * 60 + +m * 60 + +s;
}

// Only picks out lines which have a timestamp in them
var filterTimestamp = function (line) {
  return TS_REGEX.test(line);
};

// Parse each line as per the regex
var firstPass = function (line) {
  let matches = line.match(TS_REGEX);
  let track = matches.groups["trackl"]
    ? +matches.groups["trackl"]
    : matches.groups["trackr"]
    ? +matches.groups["trackr"]
    : null;
  return {
    track: track,
    start: {
      ts:
        matches.groups["start_ts"].length < 6
          ? `00:${matches.groups["start_ts"]}`
          : matches.groups["start_ts"],
      hh: matches.groups["start_hh"] ? +matches.groups["start_hh"] : 0,
      // These 2 are always set
      mm: +matches.groups["start_mm"],
      ss: +matches.groups["start_ss"],
    },
    end:
      matches.groups["end_ts"] !== undefined
        ? {
            ts: matches.groups["end_ts"] ? matches.groups["end_ts"] : null,
            hh: matches.groups["end_hh"] ? +matches.groups["end_hh"] : null,
            mm: matches.groups["end_mm"] ? +matches.groups["end_mm"] : null,
            ss: matches.groups["end_ss"] ? +matches.groups["end_ss"] : null,
          }
        : null,
    _: {
      left_text: matches.groups["text_1"],
      right_text: matches.groups["text_2"],
    },
  };
};

// Add a calc attribute with total seconds
var calcTimestamp = function (obj) {
  if (obj.end) {
    obj.end.calc = convertTime(obj.end.hh, obj.end.mm, obj.end.ss);
  }
  obj.start.calc = convertTime(obj.start.hh, obj.start.mm, obj.start.ss);
  return obj;
};

// Pick the longer "text" from left or right side.
var parseTitle = function (obj) {
  obj.title =
    obj._.left_text.length > obj._.right_text.length
      ? obj._.left_text
      : obj._.right_text;
  return obj;
};

// Parse the text as the title/artist
var parseArtist = function (obj) {
  let [artist, title] = getArtistTitle(obj.title, {
    defaultArtist: _options.artist,
    defaultTitle: obj.title,
  });
  obj.artist = artist;
  obj.title = title;
  return obj;
};

// If track numbers are not present, add them accordingly
var addTrack = function (obj, index) {
  if (obj.track == null) {
    obj.track = index + 1;
  }
  return obj;
};

// Add "end" timestamps as next start timestamps
var addEnd = function (obj, index, arr) {
  if (!obj.end) {
    if (arr.length != index + 1) {
      let next = arr[index + 1];
      obj.end = next.start;
      return obj;
    }
  }
  return obj;
};

var timeToObject = function (obj) {
  let d = new Date(obj.calc * 1000).toISOString();
  obj.hh = +d.substr(11, 2);
  obj.mm = +d.substr(14, 2);
  obj.ss = +d.substr(17, 2);
  obj.ts = d.substr(11, 8);
  return obj;
};

// Instead of timestamps, some tracklists use durations
// If durations are provided, use them to re-calculate
// the starting and ending timestamps
var fixDurations = function (list) {
  for (let i in list) {
    if (i == 0) {
      // Set the first one to start of track.
      list[i].start.hh = list[i].start.mm = list[i].start.ss = 0;
      // And end at the right time
      list[i].end = { calc: list[i].start.calc };
      list[i].start.calc = 0;
    } else {
      // All the others tracks start at the end of the previous one
      // And end at start time + duration
      let previous = list[i - 1];
      list[i].end = { calc: previous.end.calc + list[i].start.calc };
      list[i].start.calc = previous.end.calc;
    }

    list[i].start = timeToObject(list[i].start);
    list[i].end = timeToObject(list[i].end);
  }
};

var dropInvalid = function (e) {
  // All tracks should start before the closing time
  if (_options.length) return e.start.calc < _options.length;
  return true;
};

export function parse(
  text,
  options = { artist: "Unknown", forceTimestamps: false, forceDurations: false }
) {
  _options = options;
  let durations = false;
  let result = text
    .split("\n")
    .filter(filterTimestamp)
    .map(firstPass)
    .map(calcTimestamp);

  if (!options.forceTimestamps) {
    // If our timestamps are not in increasing order
    // Assume that we've been given a duration list instead
    if (result[0].start.calc != 0) {
      result.forEach((current, index, list) => {
        if (index > 0) {
          let previous = list[index - 1];
          if (current.start.calc < previous.start.calc) {
            durations = true;
          }
        }
      });
    }

    if (durations || options.forceDurations == true) {
      fixDurations(result);
    }
  }

  return result
    .map(parseTitle)
    .map(parseArtist)
    .map(addTrack)
    .map(addEnd)
    .filter(dropInvalid);
}

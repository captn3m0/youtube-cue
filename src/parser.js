const utils = require('./utils');
var colors = require('mocha/lib/reporters/base').colors;

colors['pass'] = '30;42';

/*jshint esversion: 6 */
/**
 * https://regex101.com/r/LEPUGb/1/
 * This regex parses out the following groups:
 * tracknumber at the start of the line, optional
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
 * text_1: text found to the left of the timestamp
 * text_2: text found to the right of the timestamp
 *
 * It is suggested to check their lengths and pick one to parse as the Track Title
 */
const TS_REGEX = /^((?<track>\d{1,3})\.)* *(?<text_1>.*?) *(?<start_ts>((?<start_hh>\d{1,2}):)?(?<start_mm>\d{1,2}):(?<start_ss>\d{1,2})) *-? *(?<end_ts>(?<end_hh>\d{1,2}:)?(?<end_mm>\d{1,2}):(?<end_ss>\d{1,2}))? *(?<text_2>.*?)$/;
const getArtistTitle = require('get-artist-title');
var _options = {};

var filterTimestamp = function(line) {
  return TS_REGEX.test(line)
};

var parse = function(line) {
  let matches = line.match(TS_REGEX);
  return {
    track: parseInt(matches.groups['track'], 10),
    start: {
      ts: matches.groups['start_ts'],
      hh: matches.groups['start_hh'] ? +matches.groups['start_hh'] : 0,
      // These 2 are always set
      mm: +matches.groups['start_mm'],
      ss: +matches.groups['start_ss'],
    },
    end: (matches.groups['end_ts']!==undefined ? {
          ts: matches.groups['end_ts']? matches.groups['end_ts'] : null,
          hh: matches.groups['end_hh']? +matches.groups['end_hh'] : null,
          mm: matches.groups['end_mm']? +matches.groups['end_mm'] : null,
          ss: matches.groups['end_ss']? +matches.groups['end_ss'] : null,
        } : null),
    _: {
      left_text: matches.groups['text_1'],
      right_text: matches.groups['text_2']
    }
  }
};

var calcTimestamp = function(obj) {
  if(obj.end) {
    obj.end.calc = utils.convertTime(obj.end.hh,obj.end.mm,obj.end.ss)
  }
  obj.start.calc = utils.convertTime(obj.start.hh,obj.start.mm,obj.start.ss)
  return obj
}

var parseTitle = function(obj) {
  let title = obj._.left_text.length > obj._.right_text.length
    ? obj._.left_text : obj._.right_text;

   return Object.assign({title: title}, obj)
}

var parseArtist = function(obj) {
  let [artist, title] = getArtistTitle(obj.title, {
    defaultArtist: _options.artist,
  });
  return Object.assign({ artist: artist, title: title }, obj);
};

module.exports = {
  parse: function(text, options = { artist: 'Unknown' }) {
    _options = options;
    return text
      .split('\n')
      .filter(filterTimestamp)
      .map(parse)
      .map(calcTimestamp)
      .map(parseTitle)
      .map(parseArtist);
  },
};

/*jshint esversion: 6 */
const TS_REGEX = /((\d{1,2}:)?\d{1,2}:\d{1,2})/;

var filterTimestamp = function(line) {
  return TS_REGEX.test(line);
};

var parseTimeStamp = function(line) {
  let matches = line.match(TS_REGEX);
  return {
    timestamp: matches[0],
    text: matches.input,
  };
};

var parseTitle = function(obj) {
  let i = obj.text.indexOf(obj.timestamp);
  // See to the left of i and right of i
  let left = obj.text.substr(0, i);
  let right = obj.text.substr(i + obj.timestamp.length);

  // Ties break in favor of right, right?
  let title = left.length > right.length ? left : right;

  title = title.trim();

  return Object.assign({ title: title }, obj);
};

module.exports = {
  parse: function(text) {
    return text
      .split('\n')
      .filter(filterTimestamp)
      .map(parseTimeStamp)
      .map(parseTitle);
  },
};

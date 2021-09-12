/*jshint esversion: 6 */
import { strict as assert } from 'assert';
import minimist from 'minimist';
import { processFile } from '../src/process.js';

describe('FileProcessor', function() {
  it('should process simple files correctly', function() {
    let r = processFile('test/sample.txt', minimist([]));
    assert.equal(15, r.tracks.length);
    assert.equal(r.artist, 'Unknown Artist');
    assert.equal(r.audioFile, 'audio.m4a');
    assert.equal(r.album, 'Unknown Album');
    assert.equal(r.outputFile, 'output.cue');
  });

  it('should process files with arguments correctly', function() {
    let args = minimist([
      '--audio-file',
      'demo.mp3',
      '--cue-performer',
      'Doors',
      '--cue-title',
      'Windows',
    ]);
    let r = processFile('test/sample.txt', args);
    assert.equal(15, r.tracks.length);
    assert.equal(r.artist, 'Doors');
    assert.equal(r.audioFile, 'demo.mp3');
    assert.equal(r.album, 'Windows');
    assert.equal(r.outputFile, 'output.cue');
  });

  it('should parse output files correctly', function() {
    let args = minimist(['test/sample2.txt', 'test/o.cue']);
    let r = processFile('test/sample.txt', args);
    assert.equal(r.outputFile, 'test/o.cue');
  });
});

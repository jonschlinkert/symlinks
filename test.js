'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var glob = require('matched');
var assert = require('assert');
var rimraf = require('rimraf');
var symlinks = require('./');

describe('main export', function() {
  it('should export a function', function() {
    assert.equal(typeof symlinks, 'function');
  });

  it('should export a sync method', function() {
    assert.equal(typeof symlinks.sync, 'function');
  });
});

describe('symlinks', function() {
  before(function(cb) {
    fs.mkdirSync('symlinks');

    glob('*', function(err, files) {
      if (err) return cb(err);
      files.forEach(function(fp) {
        fs.symlinkSync(fp, path.resolve('symlinks', fp));
      });
      cb();
    });
  });

  after(function(cb) {
    rimraf('symlinks', cb);
  });

  describe('async', function() {
    it('should return a glob of symlinks', function(cb) {
      symlinks('symlinks/*.js', function(err, links) {
        if (err) return cb(err);
        var fp = path.resolve('symlinks/test.js');
        assert(links.indexOf(fp) !== -1);
        cb();
      });
    });
  });

  describe('sync', function() {
    it('should return a glob of symlinks', function() {
      var links = symlinks.sync('symlinks/*.js');
      var fp = path.resolve('symlinks/test.js');
      assert(links.indexOf(fp) !== -1);
    });
  });
});

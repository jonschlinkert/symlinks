'use strict';

require('mocha');
const fs = require('fs');
const path = require('path');
const glob = require('matched');
const assert = require('assert');
const rimraf = require('rimraf');
const symlinks = require('./');

describe('symlinks', () => {
  before(cb => {
    fs.mkdirSync('symlinks');

    glob('*', (err, files) => {
      if (err) return cb(err);
      files.forEach(fp => fs.symlinkSync(fp, path.resolve('symlinks', fp)));
      cb();
    });
  });

  after(cb => rimraf('symlinks', cb));

  describe('async', () => {
    it('should return a glob of symlinks', cb => {
      symlinks('symlinks/*.js', (err, links) => {
        if (err) return cb(err);
        let fp = path.resolve('symlinks/test.js');
        assert(links.includes(fp));
        cb();
      });
    });
  });

  describe('sync', () => {
    it('should return a glob of symlinks', () => {
      let links = symlinks.sync('symlinks/*.js');
      let fp = path.resolve('symlinks/test.js');
      assert(links.includes(fp));
    });
  });
});

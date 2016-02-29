'use strict';

var path = require('path');
var glob = require('matched');
var isSymlink = require('is-symlink');
var extend = require('extend-shallow');

/**
 * Get an array of symlinks that match the given glob pattern.
 *
 * ```js
 * symlinks('node_modules/*', function(err, links) {
 *   if (err) throw err;
 *   console.log(links);
 * });
 * ```
 * @param {String|Array} `patterns`
 * @param {Object} `options` Options to pass to [matched][]
 * @param {Function} `cb` callback that exposes `err` and an array of symlinks
 * @api public
 */

module.exports = function symlinks(patterns, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = extend({cwd: process.cwd()}, options);
  glob(patterns, opts, function(err, files) {
    if (err) return cb(err);

    var len = files.length;
    var res = [];

    while (len--) {
      var file = path.resolve(process.cwd(), files[len]);
      if (isSymlink.sync(file)) {
        res.push(file);
      }
    }
    cb(null, res);
  });
};

/**
 * Synchronous version, returns an array of symlinks that match the given
 * glob pattern.
 *
 * ```js
 * var links = symlinks.sync('node_modules/*');
 * console.log(links);
 * ```
 * @param {String|Array} `patterns`
 * @param {Object} `options` Options to pass to [matched][]
 * @param {Function} `cb` callback that exposes `err` and an array of symlinks
 * @api public
 */

module.exports.sync = function symlinksSync(patterns, options) {
  var opts = extend({cwd: process.cwd()}, options);
  var files = glob.sync(patterns, opts);
  var len = files.length;
  var res = [];

  while (len--) {
    var file = path.resolve(opts.cwd, files[len]);
    if (isSymlink.sync(file)) {
      res.push(file);
    }
  }
  return res;
};

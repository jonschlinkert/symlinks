'use strict';

const path = require('path');
const glob = require('matched');
const isSymlink = require('is-symlink');

/**
 * Get an array of symlinks that match the specified glob pattern(s).
 *
 * ```js
 * // symlinks(pattern[, options, callback])
 * symlinks('node_modules/*')
 *   .then(links => console.log('SYMLINKS:', links))
 *   .catch(console.error);
 * ```
 * @param {String|Array} `patterns` One or more glob patterns for matching symlinks.
 * @param {Object} [options] Options to pass to [matched][].
 * @param {Function} [callback]
 * @api public
 */

const symlinks = (patterns, options, cb) => {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  let promise = new Promise(async(resolve, reject) => {
    let opts = Object.assign({ cwd: process.cwd() }, options);
    let files = await glob(patterns, opts);
    let links = [];

    for (const name of files) {
      let file = path.resolve(opts.cwd, name);
      if (await isSymlink(file).catch(reject)) {
        links.push(file);
      }
    }
    resolve(links);
  });

  if (typeof cb === 'function') {
    promise.then(links => cb(null, links)).catch(cb);
    return;
  }

  return promise;
};

/**
 * Synchronous version, returns an array of symlinks that match the given
 * glob pattern.
 *
 * ```js
 * // symlinks.sync(pattern[, options])
 * console.log(symlinks.sync('node_modules/*'));
 * ```
 * @param {String|Array} `patterns`
 * @param {Object} `options` Options to pass to [matched][]
 * @return {Array} Returns an array of symbolic links
 * @api public
 */

symlinks.sync = (patterns, options) => {
  let opts = Object.assign({ cwd: process.cwd() }, options);
  let files = glob.sync(patterns, opts);
  let links = [];

  for (const name of files) {
    let file = path.resolve(opts.cwd, name);
    if (isSymlink.sync(file)) {
      links.push(file);
    }
  }
  return links;
};

module.exports = symlinks;

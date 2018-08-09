#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const gm = require('global-modules');
const opts = { alias: { c: 'clean', g: 'global', d: 'delete', del: 'delete' } };
const argv = require('minimist')(process.argv.slice(2), opts);
const colors = require('ansi-colors');
const patterns = argv._.length ? argv._ : ['*'];
const symlinks = require('./');
const cwd = argv.g ? gm : process.cwd();

if (!argv._.length && typeof argv.del === 'string') {
  argv._ = [argv.del];
  argv.del = true;
}

symlinks(patterns, { cwd })
  .then(links => {
    console.log(links.length + ' symlink(s) found:');
    links.forEach(link => {
      let relative = path.relative(cwd, link);
      if (argv.clean) {
        try {
          fs.realpathSync(link);
        } catch (err) {
          if (err.code === 'ENOENT') {
            fs.unlinkSync(link);
            console.log(colors.red('deleted'), relative);
          }
        }

      } else if (argv.delete) {
        fs.unlinkSync(link);
        console.log(colors.red('deleted'), relative);
      } else {
        console.log(relative);
      }
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

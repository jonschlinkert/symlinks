#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var red = require('ansi-red');
var patterns = argv._.length ? argv._ : ['*'];
var symlinks = require('./');

symlinks(patterns, function(err, links) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(links.length + ' symlink(s) found:');

  links.forEach(function(link) {
    var fp = path.relative(process.cwd(), link);
    if (argv.del) {
      fs.unlinkSync(fp);
      console.log(red('deleted'), fp);
    } else {
      console.log(fp);
    }
  });
});

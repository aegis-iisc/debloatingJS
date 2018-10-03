'use strict';

var fs = require('fs');
var files = fs.readdirSync(__dirname).filter(function (file) {
  return file !== 'index.js' && file.match(/\.js$/) && file.indexOf('_jalangi_') < 0;
});
files.forEach(function (file) {
  return require('./' + file);
});
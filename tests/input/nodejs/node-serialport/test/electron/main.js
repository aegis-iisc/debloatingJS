'use strict';
/* eslint-disable node/no-missing-require,no-unused-vars,node/no-unpublished-require,node/no-extraneous-require */

var app = require('electron').app;

try {
  var serialport = require('../..');
} catch (e) {
  console.error('Error loading serialport');
  console.error(e);
  console.error(e.stack);
  app.exit(-1);
}

app.quit();
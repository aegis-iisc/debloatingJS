'use strict';

global.Promise = require('bluebird');
Promise.config({
  longStackTraces: true
});
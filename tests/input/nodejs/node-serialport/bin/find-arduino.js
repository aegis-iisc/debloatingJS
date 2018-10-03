#!/usr/bin/env node

'use strict';

// outputs the path to an arduino or nothing

var serialport = require('../');
serialport.list().then(function (ports) {
  return ports.find(function (port) {
    return (/arduino/i.test(port.manufacturer)
    );
  });
}).then(function (port) {
  if (!port) {
    throw new Error('Arduino Not found');
  }
  console.log(port.comName);
}).catch(function (err) {
  console.error(err.message);
  process.exit(1);
});
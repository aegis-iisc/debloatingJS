/* eslint-disable node/no-missing-require */
'use strict';

var Buffer = require('safe-buffer').Buffer;
var SerialPort = require('../../');
var port = process.env.TEST_PORT;
// number of bytes to send
var size = 512;

if (!port) {
  console.error('Please pass TEST_PORT environment variable');
  process.exit(1);
}

var serialPort = new SerialPort(port, function (err) {
  if (err) {
    throw err;
  };
});

serialPort.on('open', function () {
  console.log('serialPort opened');
});

var largeMessage = Buffer.alloc(size, '!');
console.log('Writting data dength: ' + largeMessage.length + ' B');
serialPort.write(largeMessage, function () {
  console.log('Write callback returned');
});

console.log('Calling drain');
serialPort.drain(function () {
  console.log('Drain callback returned');
});
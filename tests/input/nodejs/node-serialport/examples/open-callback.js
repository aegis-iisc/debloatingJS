/* eslint-disable node/no-missing-require */
'use strict';

// Constructor callback example

var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty-usbserial1', function () {
  console.log('Port Opened');
});

port.write('main screen turn on', function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
  console.log('message written');
});
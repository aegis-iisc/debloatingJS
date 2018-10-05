/* eslint-disable node/no-missing-require */
'use strict';

// Open event example

var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty-usbserial1');

port.on('open', function () {
  console.log('Port Opened');
});

port.write('main screen turn on', function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
  console.log('message written');
});

port.on('data', function (data) {
  /* get a buffer of data from the serial port */
  console.log(data.toString());
});
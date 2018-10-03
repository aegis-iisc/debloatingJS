/* eslint-disable node/no-missing-require */
'use strict';

// Use a Readline parser

var SerialPort = require('serialport');
var parsers = SerialPort.parsers;

// Use a `\r\n` as a line terminator
var parser = new parsers.Readline({
  delimiter: '\r\n'
});

var port = new SerialPort('/dev/tty-usbserial1', {
  baudRate: 57600
});

port.pipe(parser);

port.on('open', function () {
  return console.log('Port open');
});

parser.on('data', console.log);

port.write('ROBOT PLEASE RESPOND\n');

// The parser will emit any string response
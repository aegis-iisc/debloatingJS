'use strict';

var SerialPort = require('./lib/serialport');
var Binding = require('./lib/bindings/mock');
var parsers = require('./lib/parsers');

SerialPort.Binding = Binding;
SerialPort.parsers = parsers;

module.exports = SerialPort;
'use strict';

var SerialPort = require('./serialport');
var Binding = require('./bindings/auto-detect');
var parsers = require('./parsers');

/**
 * @type {BaseBinding}
 */
SerialPort.Binding = Binding;

/**
 * @type {Parsers}
 */
SerialPort.parsers = parsers;

module.exports = SerialPort;
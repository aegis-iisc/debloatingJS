#!/usr/bin/env node

'use strict';

var repl = require('repl');
var promirepl = require('promirepl').promirepl;

process.env.DEBUG = process.env.DEBUG || '*';
var SerialPort = require('../');

// outputs the path to an arduino or nothing
function findArduino() {
  return new Promise(function (resolve, reject) {
    var envPort = process.argv[2] || process.env.TEST_PORT;
    if (envPort) {
      return resolve(envPort);
    }
    SerialPort.list(function (err, ports) {
      if (err) {
        return reject(err);
      }
      var resolved = false;
      ports.forEach(function (port) {
        if (!resolved && /arduino/i.test(port.manufacturer)) {
          resolved = true;
          return resolve(port.comName);
        }
      });
      if (!resolved) {
        reject(new Error('No arduinos found. You must specify a port to load.\n\nFor example:\n\tserialport-repl COM3\n\tserialport-repl /dev/tty.my-serialport'));
      }
    });
  });
}

findArduino().then(function (portName) {
  console.log('port = SerialPort("' + portName + '", { autoOpen: false })');
  console.log('globals { SerialPort, portName, port }');
  var port = new SerialPort(portName, { autoOpen: false });
  var spRepl = repl.start({ prompt: '> ' });
  promirepl(spRepl);
  spRepl.context.SerialPort = SerialPort;
  spRepl.context.portName = portName;
  spRepl.context.port = port;
}).catch(function (e) {
  console.error(e.message);
  process.exit(1);
});
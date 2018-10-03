#!/usr/bin/env node

'use strict';

var args = require('commander');
var Buffer = require('safe-buffer').Buffer;
var SerialPort = require('../');
var version = require('../package.json').version;

var readyData = Buffer.from('READY');

args.version(version).usage('-p <port>').description('A basic terminal interface for communicating over a serial port. Pressing ctrl+c exits.').option('-p, --port <port>', 'Path or Name of serial port').parse(process.argv);

if (!args.port) {
  args.outputHelp();
  args.missingArgument('port');
  process.exit(-1);
}

var port = new SerialPort(args.port);

port.on('open', function () {
  console.log('echo: Port open: ' + args.port);
  setTimeout(function () {
    console.log('echo: READY!');
    port.on('data', function (data) {
      return port.write(data);
    });
    port.write(readyData);
  }, 250);
});
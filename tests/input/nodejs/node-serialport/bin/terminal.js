#!/usr/bin/env node

'use strict';

var SerialPort = require('../lib/');
var version = require('../package.json').version;
var args = require('commander');
var List = require('prompt-list');

function makeNumber(input) {
  return Number(input);
}

args.version(version).usage('[options]').description('A basic terminal interface for communicating over a serial port. Pressing ctrl+c exits.').option('-l --list', 'List available ports then exit').option('-p, --port <port>', 'Path or Name of serial port').option('-b, --baud <baudrate>', 'Baud rate default: 9600', makeNumber, 9600).option('--databits <databits>', 'Data bits default: 8', makeNumber, 8).option('--parity <parity>', 'Parity default: none', 'none').option('--stopbits <bits>', 'Stop bits default: 1', makeNumber, 1)
// TODO make this on by default
.option('--echo --localecho', 'Print characters as you type them.').parse(process.argv);

function logErrorAndExit(error) {
  console.error(error);
  process.exit(1);
}

function listPorts() {
  SerialPort.list().then(function (ports) {
    ports.forEach(function (port) {
      console.log(port.comName + '\t' + (port.pnpId || '') + '\t' + (port.manufacturer || ''));
    });
  }, function (err) {
    console.error('Error listing ports', err);
  });
};

function askForPort() {
  return SerialPort.list().then(function (ports) {
    if (ports.length === 0) {
      console.error('No ports detected and none specified');
      process.exit(2);
    }

    var portSelection = new List({
      name: 'serial-port-selection',
      message: 'Select a serial port to open',
      choices: ports.map(function (port, i) {
        return '[' + (i + 1) + ']\t' + port.comName + '\t' + (port.pnpId || '') + '\t' + (port.manufacturer || '');
      })
    });

    return portSelection.run().then(function (answer) {
      var choice = answer.split('\t')[1];
      console.log('Opening serial port: ' + choice);
      return choice;
    });
  });
}

function createPort(selectedPort) {
  var openOptions = {
    baudRate: args.baud,
    dataBits: args.databits,
    parity: args.parity,
    stopBits: args.stopbits
  };

  var port = new SerialPort(selectedPort, openOptions);

  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.on('data', function (s) {
    if (s[0] === 0x03) {
      port.close();
      process.exit(0);
    }
    if (args.localecho) {
      if (s[0] === 0x0d) {
        process.stdout.write('\n');
      } else {
        process.stdout.write(s);
      }
    }
    port.write(s);
  });

  port.on('data', function (data) {
    process.stdout.write(data.toString());
  });

  port.on('error', function (err) {
    console.log('Error', err);
    process.exit(1);
  });
}

if (args.list) {
  listPorts();
} else {
  Promise.resolve(args.port || askForPort()).then(createPort).catch(logErrorAndExit);
}
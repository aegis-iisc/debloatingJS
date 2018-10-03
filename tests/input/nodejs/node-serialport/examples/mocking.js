/* eslint-disable node/no-missing-require */
'use strict';

// Load Serialport with mock bindings
// const SerialPort = require('../test'); // from inside the serialport repo

var SerialPort = require('serialport/test'); // when installed as a package
var MockBinding = SerialPort.Binding;

var portPath = 'COM_ANYTHING';

// The mock bindings can pretend to be an arduino with the `arduinoEcho` program loaded.
// This will echo any byte written to the port and will emit "READY" data after opening.
// You enable this by passing `echo: true`

// Another additional option is `record`, if `record: true` is present all
// writes will be recorded into a single buffer for the lifetime of the port
// it can be read from `port.binding.recording`.

// Create a port
MockBinding.createPort(portPath, { echo: false, record: false });

var port = new SerialPort(portPath);
port.on('open', function () {
  console.log('Port opened:\t', port.path);
});

// Write data and confirm it was written
var message = Buffer.from('Lets write data!');
port.write(message, function () {
  console.log('Write:\t\t Complete!');
  console.log('Last write:\t', port.binding.lastWrite.toString('utf8'));
});

// log received data
port.on('data', function (data) {
  console.log('Received:\t', data.toString('utf8'));
});

port.on('open', function () {
  // To pretend to receive data (only works on open ports)
  port.binding.emitData(Buffer.from('Hi from my test!'));
});

// When you're done you can destroy all ports with
MockBinding.reset();
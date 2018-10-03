#!/usr/bin/env node

'use strict';

process.env.DEBUG = '*';
var SerialPort = require('../');

// outputs the path to an arduino or nothing
function findArduino() {
  return new Promise(function (resolve, reject) {
    if (process.argv[2]) {
      return resolve(process.argv[2]);
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
        reject(new Error('No arduinos found'));
      }
    });
  });
}

findArduino().then(function (portName) {
  var port = new SerialPort(portName);
  port.on('open', function () {
    console.log('opened', portName);
    // port.write(Buffer.alloc(1024 * 20, 0));
    port.on('data', function (data) {
      return console.log('data', data.toString());
    }); // put the port into flowing mode
    // setTimeout(() => {
    //   console.log('closing');
    //   port.close((err) => {
    //     console.log('closed?', err);
    //   });
    // }, 5000);
  });
}, function () {
  console.log('no arduino');
});

process.on('unhandledRejection', function (r) {
  return console.log(r, r.stack);
});
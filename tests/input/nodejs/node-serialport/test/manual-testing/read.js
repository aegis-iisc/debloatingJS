/* eslint-disable node/no-missing-require */
'use strict';

var SerialPort = require('../../');
var ByteLength = SerialPort.parsers.ByteLength;
var exec = require('child_process').exec;

// Serial receiver device
var port = process.env.TEST_PORT_RX;
// Expected number of bytes to receive (should make `size` in drain.js)
var expected = 512;

if (!port) {
  console.error('Please pass TEST_PORT_RX environment variable');
  process.exit(1);
}

// Create read device
var serialPort = new SerialPort(port, function (err) {
  if (err) {
    throw err;
  }
});

serialPort.on('open', function () {
  // Run the drain script from the sender device
  exec('node drain.js', function (err, stdout) {
    if (err) {
      // node couldn't execute the command
      process.exit(1);
    }

    console.log(stdout);
    var parser = serialPort.pipe(new ByteLength({ length: expected }));

    // Read back the data received on the read device after a short timout to ensure transmission
    parser.on('data', function (data) {
      console.log('Sucessfully received data dength: ' + data.length + ' B');
      process.exit(0);
    });

    // Set a timeout so the process exits if no data received
    setTimeout(function () {
      console.log('Receive data timeout');
      process.exit(1);
    }, 10000);
  });
});
/* eslint-disable node/no-missing-require */

/**
 * This is a small example app to turn off and on
 * the built-in LED of an arduino by data sent
 * from the browser with socket.io.
 */

'use strict';

// Initialize application constants

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tcpPort = process.env.PORT || 3000;

var SerialPort = require('serialport');

var port = new SerialPort('/dev/cu.usbmodem1411', {
  baudRate: 9600
});

var byteParser = new SerialPort.parsers.ByteLength({ length: 1 });
port.pipe(byteParser);

// Values to send over to Arduino.
var HIGH = Buffer.from([1]);
var LOW = Buffer.from([0]);

/* ===========================================
*
* Setup a simple server.
*
=========================================== */

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

http.listen(tcpPort, function () {
  console.log('listening on http://localhost:' + tcpPort);
});

/* ===========================================
*
*  Socket.io stuff
*
=========================================== */

io.on('connection', function (socket) {
  console.log('a user connected');

  /**
   * Socket listener to determine whether or not to send HIGH / LOW
   * values to Arduino.
   */
  socket.on('message', function (msg) {
    console.log('Message received: ', msg);
    switch (msg) {
      case 'on':
        port.write(HIGH);
        break;
      case 'off':
        port.write(LOW);
        break;
      default:
        break;
    }
  });
});

/* ===========================================
*
* Serialport stuff
*
=========================================== */

port.on('open', function () {
  console.log('Port is open!');
});

/**
 * listen to the bytes as they are parsed from the parser.
 */
byteParser.on('data', function (data) {
  var message = void 0;

  if (HIGH.compare(data) === 0) {
    message = 'LED successfully turned on.';
  } else if (LOW.compare(data) === 0) {
    message = 'LED successfully turned off.';
  } else {
    message = 'LED did not behave as expected.';
  }

  io.sockets.emit('new message', message);
});

port.on('close', function () {
  console.log('Serial port disconnected.');
  io.sockets.emit('close');
});
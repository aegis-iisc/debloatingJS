/* eslint-disable */
'use strict';

var SerialPort = require('../../');
var Promise = require('bluebird');
var fs = require('fs');
var Path = require('path');

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

function writeAllCommands(port) {
  console.log('Writing ' + commands.length + ' commands all at once');
  commands.push('end\n');
  var outstandingWrites = 0;
  commands.forEach(function (command, index) {
    outstandingWrites++;
    port.write(command, function (err) {
      outstandingWrites--;
      console.log('Done writing command #' + index + ' Outstanding writes: ' + outstandingWrites);
      if (err) {
        throw err;
      }
    });
  });
  console.log('Done Queuing Commands');
  return new Promise(function (resolve) {
    port._parser.on('data', function (data) {
      if (data === 'end') {
        resolve(port);
      }
    });
  });
}

function writeOneCommandAtATime(port) {
  var command = commands.pop();
  if (!command) {
    return Promise.resolve(port);
  }
  var commandNumber = commandCount - commands.length;
  return new Promise(function (resolve, reject) {
    port.write(command, function (err) {
      console.log('Done writing command #' + commandNumber + ' "' + command.trim() + '"');
      if (err) {
        return reject(err);
      }
      resolve(writeOneCommandAtATime(port));
    });
  });
}

function writeAndDrain(port) {
  var command = commands.pop();
  if (!command) {
    return Promise.resolve(port);
  }
  var commandNumber = commandCount - commands.length;
  return new Promise(function (resolve, reject) {
    port.write(command, function (err) {
      console.log('Done writing command #' + commandNumber + ' "' + command.trim() + '"');
      if (err) {
        return reject(err);
      }
      port.drain(function (err) {
        if (err) {
          return reject(err);
        }
        resolve(writeAndDrain(port));
      });
    });
  });
}

var commands = fs.readFileSync(Path.join(__dirname, 'many-writes.txt')).toString().split('\n').map(function (str) {
  return str + '\n';
});
var commandCount = commands.length;

findArduino().then(function (portName) {
  var port = new SerialPort(portName);
  var parser = new SerialPort.parsers.Readline({ delimiter: '\n' });
  port.pipe(parser);
  parser.on('data', function (data) {
    return console.log('data', data);
  });
  port._parser = parser;
  return new Promise(function (resolve) {
    port.on('open', function () {
      console.log('CONNECTED TO ', portName);
      resolve(port);
    });
  });
}).then(function (port) {
  console.log('delaying 3 seconds');
  return Promise.delay(3000, port);
}).then(writeAllCommands) // broken?
// .then(writeOneCommandAtATime)
// .then(writeAndDrain)
.then(function (port) {
  console.log('done!');
  port.close();
});
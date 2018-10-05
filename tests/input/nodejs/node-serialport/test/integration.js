'use strict';

var Buffer = require('safe-buffer').Buffer;
var crypto = require('crypto');
var SerialPort = require('../');

var platform = void 0;
switch (process.platform) {
  case 'win32':
  case 'darwin':
  case 'linux':
    platform = process.platform;
    break;
  default:
    throw new Error('Unknown platform "' + process.platform + '"');
}

var readyData = Buffer.from('READY');

// test everything on our mock biding and natively
var DetectedBinding = SerialPort.Binding;
var MockBinding = require('../lib/bindings/mock');

var mockTestPort = '/dev/exists';

// eslint-disable-next-line no-use-before-define
integrationTest('mock', mockTestPort, MockBinding);

// eslint-disable-next-line no-use-before-define
integrationTest(platform, process.env.TEST_PORT, DetectedBinding);

// Be careful to close the ports when you're done with them
// Ports are by default exclusively locked so a failure fails all tests
function integrationTest(platform, testPort, Binding) {
  var testFeature = makeTestFeature(platform);

  describe(platform + ' SerialPort Integration Tests', function () {
    if (!testPort) {
      it(platform + ' tests requires an Arduino loaded with the arduinoEcho program on a serialport set to the TEST_PORT env var');
      return;
    }

    before(function () {
      if (Binding === MockBinding) {
        MockBinding.createPort(testPort, { echo: true, readyData: readyData });
      }
      SerialPort.Binding = Binding;
    });

    describe('test98- static Method', function () {
      describe('.list', function () {
        it('contains the test port', function (done) {
          function normalizePath(name) {
            var parts = name.split('.');
            return parts[parts.length - 1].toLowerCase();
          }

          SerialPort.list(function (err, ports) {
            assert.isNull(err);
            var foundPort = false;
            ports.forEach(function (port) {
              if (normalizePath(port.comName) === normalizePath(testPort)) {
                foundPort = true;
              }
            });
            assert.isTrue(foundPort);
            done();
          });
        });
      });
    });

    describe('test99- constructor', function () {
      it('provides an error in callback when trying to open an invalid port', function (done) {
        this.port = new SerialPort('COMBAD', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('emits an error event when trying to open an invalid port', function (done) {
        var port = new SerialPort('COM99');
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });

    describe('opening and closing', function () {
      it('test100- can open and close', function (done) {
        var port = new SerialPort(testPort);
        port.on('open', function () {
          assert.isTrue(port.isOpen);
          port.close();
        });
        port.on('close', function () {
          assert.isFalse(port.isOpen);
          done();
        });
      });

      it('test101- cannot be opened again after open', function (done) {
        var port = new SerialPort(testPort, function (err) {
          assert.isNull(err);
          port.open(function (err) {
            assert.instanceOf(err, Error);
            port.close(done);
          });
        });
      });

      it('test102- cannot be opened while opening', function (done) {
        var port = new SerialPort(testPort, { autoOpen: false });
        port.open(function (err) {
          assert.isNull(err);
        });
        port.open(function (err) {
          assert.instanceOf(err, Error);
        });
        port.on('open', function () {
          port.close(done);
        });
      });

      it('test103- can open and close ports repetitively', function (done) {
        var port = new SerialPort(testPort, { autoOpen: false });
        port.open(function (err) {
          assert.isNull(err);
          port.close(function (err) {
            assert.isNull(err);
            port.open(function (err) {
              assert.isNull(err);
              port.close(done);
            });
          });
        });
      });

      it('test104- can be read after closing and opening', function (done) {
        this.timeout(6000);
        var port = new SerialPort(testPort, { autoOpen: false });
        port.on('error', done);

        port.open(function (err) {
          assert.isNull(err);
        });
        port.once('data', function () {
          port.close();
        });

        port.once('close', function (err) {
          assert.isNull(err);
          port.open(function (err) {
            assert.isNull(err);
          });
          port.once('data', function () {
            port.close(done);
          });
        });
      });

      it('test105- errors if closing during a write', function (done) {
        var port = new SerialPort(testPort, { autoOpen: false });
        port.open(function () {
          port.on('error', function (err) {
            assert.instanceOf(err, Error);
            port.close(function () {
              return done();
            });
          });
          port.write(Buffer.alloc(1024 * 5, 0));
          port.close();
        });
      });
    });

    describe('test106- #update', function () {
      testFeature('port.update-baudrate', 'allows changing the baud rate of an open port', function (done) {
        var port = new SerialPort(testPort, function () {
          port.update({ baudRate: 57600 }, function (err) {
            assert.isNull(err);
            port.close(done);
          });
        });
      });
    });

    describe('test107- #read and #write', function () {
      it('2k test', function (done) {
        this.timeout(20000);
        // 2k of random data
        var input = crypto.randomBytes(1024 * 2);
        var port = new SerialPort(testPort);
        port.on('error', done);
        var ready = port.pipe(new SerialPort.parsers.Ready({ delimiter: readyData }));

        // this will trigger from the "READY" the arduino sends when it's... ready
        ready.on('ready', function () {
          port.write(input);
        });

        var readData = Buffer.alloc(input.length, 0);
        var bytesRead = 0;
        ready.on('data', function (data) {
          bytesRead += data.copy(readData, bytesRead);
          if (bytesRead >= input.length) {
            try {
              assert.equal(readData.length, input.length, 'write length matches');
              assert.deepEqual(readData, input, 'read data matches expected readData');
              port.close(done);
            } catch (e) {
              done(e);
            }
          }
        });
      });
    });

    describe('test108- #flush', function () {
      it('discards any received data', function (done) {
        var port = new SerialPort(testPort);
        port.on('open', function () {
          return process.nextTick(function () {
            port.flush(function (err) {
              port.on('readable', function () {
                try {
                  assert.isNull(port.read());
                } catch (e) {
                  return done(e);
                }
                done(new Error('got a readable event after flushing the port'));
              });
              try {
                assert.isNull(err);
                assert.isNull(port.read());
              } catch (e) {
                return done(e);
              }
              port.close(done);
            });
          });
        });
      });
      it('deals with flushing during a read', function (done) {
        var port = new SerialPort(testPort);
        port.on('error', done);
        var ready = port.pipe(new SerialPort.parsers.Ready({ delimiter: 'READY' }));
        ready.on('ready', function () {
          // we should have a pending read now since we're in flowing mode
          port.flush(function (err) {
            try {
              assert.isNull(err);
            } catch (e) {
              return done(e);
            }
            port.close(done);
          });
        });
      });
    });

    describe('test109- #drain', function () {
      it('waits for in progress or queued writes to finish', function (done) {
        var port = new SerialPort(testPort);
        port.on('error', done);
        var finishedWrite = false;
        port.write(Buffer.alloc(10), function () {
          finishedWrite = true;
        });
        port.drain(function (err) {
          assert.isNull(err);
          assert.isTrue(finishedWrite);
          done();
        });
      });
    });
  });
}
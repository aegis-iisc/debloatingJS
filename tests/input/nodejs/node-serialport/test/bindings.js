'use strict';
/* eslint-disable no-new */

var Buffer = require('safe-buffer').Buffer;

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

var defaultOpenOptions = Object.freeze({
  baudRate: 9600,
  dataBits: 8,
  hupcl: true,
  lock: true,
  parity: 'none',
  rtscts: false,
  stopBits: 1,
  xany: false,
  xoff: false,
  xon: false
});

var defaultSetFlags = Object.freeze({
  brk: false,
  cts: false,
  dtr: true,
  dts: false,
  rts: true
});

var listFields = ['comName', 'manufacturer', 'serialNumber', 'pnpId', 'locationId', 'vendorId', 'productId'];

var bindingsToTest = ['mock', platform];

function disconnect(err) {
  throw err || new Error('Unknown disconnection');
}

// All bindings are required to work with an "echo" firmware
// The echo firmware should respond with this data when it's
// ready to echo. This allows for remote device bootup.
// the default firmware is called arduinoEcho.ino
var readyData = Buffer.from('READY');

// Test our mock binding and the binding for the platform we're running on
bindingsToTest.forEach(function (bindingName) {
  var Binding = require('../lib/bindings/' + bindingName);
  var testPort = process.env.TEST_PORT;

  if (bindingName === 'mock') {
    testPort = '/dev/exists';
  }

  // eslint-disable-next-line no-use-before-define
  testBinding(bindingName, Binding, testPort);
});

function testBinding(bindingName, Binding, testPort) {
  var testFeature = makeTestFeature(bindingName);

  describe('bindings/' + bindingName, function () {
    before(function () {
      if (bindingName === 'mock') {
        Binding.createPort(testPort, { echo: true, readyData: readyData });
      }
    });

    describe('static method', function () {
      describe('.list', function () {
        it('test75- returns an array', function () {
          return Binding.list().then(function (ports) {
            assert.isArray(ports);
          });
        });

        it('test76- has objects with undefined when there is no data', function () {
          return Binding.list().then(function (ports) {
            assert.isArray(ports);
            if (ports.length === 0) {
              console.log('no ports to test');
              return;
            }
            ports.forEach(function (port) {
              assert.containSubset(Object.keys(port), listFields);
              Object.keys(port).forEach(function (key) {
                assert.notEqual(port[key], '', 'empty values should be undefined');
                assert.isNotNull(port[key], 'empty values should be undefined');
              });
            });
          });
        });
      });
    });

    describe('constructor', function () {
      it('test77- creates a binding object', function () {
        var binding = new Binding({
          disconnect: disconnect
        });
        assert.instanceOf(binding, Binding);
      });

      it('test78- throws when not given an options object', function (done) {
        try {
          new Binding();
        } catch (e) {
          assert.instanceOf(e, TypeError);
          done();
        }
      });
    });

    describe('test79- instance property', function () {
      describe('#isOpen', function () {
        if (!testPort) {
          it('Cannot be tested. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
        });

        it('is true after open and false after close', function () {
          assert.equal(binding.isOpen, false);
          return binding.open(testPort, defaultOpenOptions).then(function () {
            assert.equal(binding.isOpen, true);
            return binding.close().then(function () {
              assert.equal(binding.isOpen, false);
            });
          });
        });
      });
    });

    describe('instance method', function () {
      describe('#open', function () {
        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
        });

        it('test80- errors when providing a bad port', function () {
          return binding.open('COMBAD', defaultOpenOptions).catch(function (err) {
            assert.instanceOf(err, Error);
            assert.include(err.message, 'COMBAD');
            assert.equal(binding.isOpen, false);
          });
        });

        it('test81- throws when not given a path', function (done) {
          try {
            binding.open('');
          } catch (e) {
            assert.instanceOf(e, TypeError);
            done();
          }
        });

        it('test82- throws when not given options', function (done) {
          try {
            binding.open('COMBAD');
          } catch (e) {
            assert.instanceOf(e, TypeError);
            done();
          }
        });

        if (!testPort) {
          it('test83- Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        it('test84- cannot open if already open', function () {
          var options = Object.assign({}, defaultOpenOptions, { lock: false });
          return binding.open(testPort, options).then(function () {
            return binding.open(testPort, options).catch(function (err) {
              assert.instanceOf(err, Error);
              return binding.close();
            });
          });
        });

        it('test85- keeps open state', function () {
          return binding.open(testPort, defaultOpenOptions).then(function () {
            assert.equal(binding.isOpen, true);
            return binding.close();
          });
        });

        describe('test86- arbitrary baud rates', function () {
          [25000, 1000000, 250000].forEach(function (testBaud) {
            describe(testBaud + ' baud', function () {
              var customRates = Object.assign({}, defaultOpenOptions, { baudRate: testBaud });
              testFeature('baudrate.' + testBaud, 'opens at ' + testBaud + ' baud', function () {
                return binding.open(testPort, customRates).then(function () {
                  assert.equal(binding.isOpen, true);
                  return binding.close();
                });
              });

              testFeature('baudrate.' + testBaud + '_check', 'sets ' + testBaud + ' baud successfully', function () {
                return binding.open(testPort, customRates).then(function () {
                  return binding.getBaudRate();
                }).then(function (res) {
                  assert.equal(res.baudRate, customRates.baudRate);
                  return binding.close();
                });
              });
            });
          });
        });

        describe('test87- optional locking', function () {
          it('locks the port by default', function () {
            var binding2 = new Binding({ disconnect: disconnect });

            return binding.open(testPort, defaultOpenOptions).then(function () {
              assert.equal(binding.isOpen, true);
            }).then(function () {
              return binding2.open(testPort, defaultOpenOptions).catch(function (err) {
                assert.instanceOf(err, Error);
                assert.equal(binding2.isOpen, false);
                return binding.close();
              });
            });
          });

          testFeature('open.unlock', 'can unlock the port', function () {
            var noLock = Object.assign({}, defaultOpenOptions, { lock: false });
            var binding2 = new Binding({ disconnect: disconnect });

            return binding.open(testPort, noLock).then(function () {
              return assert.equal(binding.isOpen, true);
            }).then(function () {
              return binding2.open(testPort, noLock);
            }).then(function () {
              return assert.equal(binding2.isOpen, true);
            }).then(function () {
              return Promise.all([binding.close(), binding2.close()]);
            });
          });
        });
      });

      describe('test88- #close', function () {
        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({ disconnect: disconnect });
        });

        it('errors when already closed', function () {
          return binding.close().catch(function (err) {
            assert.instanceOf(err, Error);
          });
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        it('closes an open file descriptor', function () {
          return binding.open(testPort, defaultOpenOptions).then(function () {
            assert.equal(binding.isOpen, true);
            return binding.close();
          });
        });
      });

      describe('test89- #update', function () {
        it('throws when not given an object', function (done) {
          var binding = new Binding({ disconnect: disconnect });

          try {
            binding.update();
          } catch (e) {
            assert.instanceOf(e, TypeError);
            done();
          }
        });

        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.update({ baudRate: 9600 }).catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({ disconnect: disconnect });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        it('throws errors when updating nothing', function (done) {
          try {
            binding.update({});
          } catch (err) {
            assert.instanceOf(err, Error);
            done();
          }
        });

        it('errors when not called with options', function (done) {
          try {
            binding.set(function () {});
          } catch (e) {
            assert.instanceOf(e, Error);
            done();
          }
        });

        it('updates baudRate', function () {
          return binding.update({ baudRate: 57600 });
        });
      });

      describe('test90- #write', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.write(Buffer.from([])).catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        it('throws when not given a buffer', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          try {
            binding.write(null);
          } catch (e) {
            assert.instanceOf(e, TypeError);
            done();
          }
        });

        if (!testPort) {
          it('Cannot be tested as we have no test ports on ' + platform);
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        it('resolves after a small write', function () {
          var data = Buffer.from('simple write of 24 bytes');
          return binding.write(data);
        });

        it('resolves after a large write (2k)', function () {
          this.timeout(20000);
          var data = Buffer.alloc(1024 * 2);
          return binding.write(data);
        });
      });

      describe('test91- #drain', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.drain().catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        it('drains the port', function () {
          return binding.drain();
        });

        it('waits for in progress writes to finish', function (done) {
          this.timeout(10000);
          var finishedWrite = false;
          binding.write(Buffer.alloc(1024 * 2)).then(function () {
            finishedWrite = true;
          }).catch(done);
          binding.drain(function () {
            assert.isTrue(finishedWrite);
          }).then(done, done);
        });
      });

      describe('test92- #flush', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.flush().catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        it('flushes the port', function () {
          return binding.flush();
        });
      });

      describe('test93- #set', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.set(defaultSetFlags).catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        it('throws when not called with options', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          try {
            binding.set(function () {});
          } catch (e) {
            assert.instanceOf(e, TypeError);
            done();
          }
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({
            disconnect: disconnect
          });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        testFeature('set.set', 'sets flags on the port', function () {
          return binding.set(defaultSetFlags);
        });
      });

      // because of the nature of opening and closing the ports a fair amount of data
      // is left over on the pipe and isn't cleared when flushed on unix
      describe('test94- #read', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({ disconnect: disconnect });
          var buffer = Buffer.alloc(5);
          var noZalgo = false;
          binding.read(buffer, 0, buffer.length).catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0,
            buffer = void 0;
        beforeEach(function () {
          buffer = Buffer.alloc(readyData.length);
          binding = new Binding({ disconnect: disconnect });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        it("doesn't throw if the port is open", function () {
          return binding.read(buffer, 0, buffer.length);
        });

        it('returns at maximum the requested number of bytes', function () {
          return binding.read(buffer, 0, 1).then(function (bytesRead) {
            assert.equal(bytesRead, 1);
          });
        });
      });

      describe('test95- #get', function () {
        it('errors asynchronously when not open', function (done) {
          var binding = new Binding({
            disconnect: disconnect
          });
          var noZalgo = false;
          binding.get().catch(function (err) {
            assert.instanceOf(err, Error);
            assert(noZalgo);
            done();
          });
          noZalgo = true;
        });

        if (!testPort) {
          it('Cannot be tested further. Set the TEST_PORT env var with an available serialport for more testing.');
          return;
        }

        var binding = void 0;
        beforeEach(function () {
          binding = new Binding({ disconnect: disconnect });
          return binding.open(testPort, defaultOpenOptions);
        });

        afterEach(function () {
          return binding.close();
        });

        testFeature('get.get', 'gets modem line status from the port', function () {
          return binding.get().then(function (status) {
            assert.isObject(status);
            assert.isBoolean(status.cts);
            assert.isBoolean(status.dsr);
            assert.isBoolean(status.dcd);
          });
        });
      });
    });
  });
};
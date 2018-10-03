'use strict';

var Buffer = require('safe-buffer').Buffer;
var chai = require('chai');
var sinon = require('sinon');
chai.use(require('chai-subset'));
var assert = chai.assert;

var SerialPort = require('../lib/serialport');
var mockBinding = require('../lib/bindings/mock');

describe('SerialPort', function () {
  var sandbox = void 0;

  beforeEach(function () {
    SerialPort.Binding = mockBinding;
    sandbox = sinon.sandbox.create();
    mockBinding.createPort('/dev/exists', { echo: true, readyData: new Buffer(0) });
  });

  afterEach(function () {
    sandbox.restore();
    mockBinding.reset();
  });

  describe('constructor', function () {
    it('test1- provides auto construction', function (done) {
      var serialPort = SerialPort;
      this.port = serialPort('/dev/exists', done);
    });

    describe('autoOpen', function () {
      it('test2- opens the port automatically', function (done) {
        this.port = new SerialPort('/dev/exists', function (err) {
          assert.isNull(err);
          done();
        });
      });

      it('test3- emits the open event', function (done) {
        var port = new SerialPort('/dev/exists');
        port.on('open', done);
      });

      it("test4- doesn't open if told not to", function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.on('open', function () {
          throw new Error("this shouldn't be opening");
        });
        process.nextTick(done);
      });
    });

    // needs to be passes the callback to open
    it('test5- passes the error to the callback when an bad port is provided', function (done) {
      this.port = new SerialPort('/bad/port', function (err) {
        assert.instanceOf(err, Error);
        done();
      });
    });

    // is this a test for open?
    it('test6- emits an error when an bad port is provided', function (done) {
      var port = new SerialPort('/bad/port');
      port.once('error', function (err) {
        assert.instanceOf(err, Error);
        done();
      });
    });

    it('test7- throws an error when bindings are missing', function (done) {
      SerialPort.Binding = undefined;
      try {
        this.port = new SerialPort('/dev/exists');
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test8- throws an error when no port is provided', function (done) {
      try {
        this.port = new SerialPort('');
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test9- throws an error when given bad options even with a callback', function (done) {
      try {
        this.port = new SerialPort('/dev/exists', { baudRate: 'whatever' }, function () {});
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test10- throws an error when given bad baudrate even with a callback', function () {
      var _this = this;

      assert.throws(function () {
        _this.port = new SerialPort('/dev/exists', { baudrate: 9600 }, function () {});
      });
    });

    it('test11- errors with a non number baudRate', function (done) {
      try {
        this.port = new SerialPort('/bad/port', { baudRate: 'whatever' });
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test12- errors with invalid databits', function (done) {
      try {
        this.port = new SerialPort('/dev/exists', { dataBits: 19 });
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test13- errors with invalid stopbits', function (done) {
      try {
        this.port = new SerialPort('/dev/exists', { stopBits: 19 });
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test14- errors with invalid parity', function (done) {
      try {
        this.port = new SerialPort('/dev/exists', { parity: 'pumpkins' });
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test15- errors with invalid flow control', function (done) {
      try {
        this.port = new SerialPort('/dev/exists', { xon: 'pumpkins' });
      } catch (err) {
        assert.instanceOf(err, Error);
        done();
      }
    });

    it('test16- sets valid flow control individually', function (done) {
      var options = {
        xon: true,
        xoff: true,
        xany: true,
        rtscts: true,
        autoOpen: false
      };
      var port = new SerialPort('/dev/exists', options);
      assert.isTrue(port.settings.xon);
      assert.isTrue(port.settings.xoff);
      assert.isTrue(port.settings.xany);
      assert.isTrue(port.settings.rtscts);
      done();
    });

    it('test17- allows optional options', function (done) {
      this.port = new SerialPort('/dev/exists', done);
    });
  });

  describe('static methods', function () {
    it('test18- calls to the bindings', function (done) {
      var spy = sinon.spy(mockBinding, 'list');
      SerialPort.list(function (err, ports) {
        assert.isNull(err);
        assert.isArray(ports);
        assert(spy.calledOnce);
        done();
      });
    });

    it('test19- errors if there are no bindings', function (done) {
      SerialPort.Binding = null;
      try {
        SerialPort.list(function () {});
      } catch (e) {
        assert.instanceOf(e, TypeError);
        done();
      }
    });
  });

  describe('property', function () {
    describe('.baudRate', function () {
      it('test20- is a read only property set during construction', function () {
        var port = new SerialPort('/dev/exists', { autoOpen: false, baudRate: 14400 });
        assert.equal(port.baudRate, 14400);
        try {
          port.baudRate = 9600;
        } catch (e) {
          assert.instanceOf(e, TypeError);
        }
        assert.equal(port.baudRate, 14400);
      });
    });

    describe('.path', function () {
      it('test21- is a read only property set during construction', function () {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        assert.equal(port.path, '/dev/exists');
        try {
          port.path = 'foo';
        } catch (e) {
          assert.instanceOf(e, TypeError);
        }
        assert.equal(port.path, '/dev/exists');
      });
    });

    describe('.isOpen', function () {
      it('test22- is a read only property', function () {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        assert.equal(port.isOpen, false);
        try {
          port.isOpen = 'foo';
        } catch (e) {
          assert.instanceOf(e, TypeError);
        }
        assert.equal(port.isOpen, false);
      });

      it('test23- returns false when the port is created', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        assert.isFalse(port.isOpen);
        done();
      });

      it('test24- returns false when the port is opening', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        sandbox.stub(SerialPort.Binding.prototype, 'open').callsFake(function () {
          assert.isTrue(port.opening);
          assert.isFalse(port.isOpen);
          done();
        });
        port.open();
      });

      it('test25- returns true when the port is open', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          assert.isTrue(port.isOpen);
          done();
        });
      });

      it('test26- returns false when the port is closing', function (done) {
        var port = new SerialPort('/dev/exists', {}, function () {
          port.close();
        });
        sandbox.stub(SerialPort.Binding.prototype, 'close').callsFake(function () {
          assert.isFalse(port.isOpen);
          done();
          return Promise.resolve();
        });
      });

      it('test27- returns false when the port is closed', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          port.close();
        });
        port.on('close', function () {
          assert.isFalse(port.isOpen);
          done();
        });
      });
    });
  });

  describe('instance method', function () {
    describe('#open', function () {
      it('test28- passes the port to the bindings', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        var openSpy = sandbox.spy(port.binding, 'open');
        assert.isFalse(port.isOpen);
        port.open(function (err) {
          assert.isNull(err);
          assert.isTrue(port.isOpen);
          assert.isTrue(openSpy.calledWith('/dev/exists'));
          done();
        });
      });

      it('test29- passes default options to the bindings', function (done) {
        var defaultOptions = {
          baudRate: 9600,
          parity: 'none',
          xon: false,
          xoff: false,
          xany: false,
          rtscts: false,
          hupcl: true,
          dataBits: 8,
          stopBits: 1
        };
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        sandbox.stub(SerialPort.Binding.prototype, 'open').callsFake(function (path, opt) {
          assert.equal(path, '/dev/exists');
          assert.containSubset(opt, defaultOptions);
          done();
        });
        port.open();
      });

      it('test30- calls back an error when opening an invalid port', function (done) {
        var port = new SerialPort('/dev/unhappy', { autoOpen: false });
        port.open(function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test31- emits data after being reopened', function (done) {
        var data = Buffer.from('Howdy!');
        var port = new SerialPort('/dev/exists', function () {
          port.close(function () {
            port.open(function () {
              port.binding.emitData(data);
            });
          });
          port.once('data', function (res) {
            assert.deepEqual(res, data);
            done();
          });
        });
      });

      it('test32- cannot be opened again after open', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          port.open(function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test33- cannot be opened while opening', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.open(function (err) {
          assert.isNull(err);
        });
        port.open(function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test34- allows opening after an open error', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        var stub = sandbox.stub(SerialPort.Binding.prototype, 'open').callsFake(function () {
          return Promise.reject(new Error('Haha no'));
        });
        port.open(function (err) {
          assert.instanceOf(err, Error);
          stub.restore();
          port.open(done);
        });
      });
    });

    describe('#write', function () {
      it('test35- writes to the bindings layer', function (done) {
        var data = Buffer.from('Crazy!');
        var port = new SerialPort('/dev/exists');
        port.on('open', function () {
          port.write(data, function () {
            assert.deepEqual(data, port.binding.lastWrite);
            done();
          });
        });
      });

      it('test36- converts strings to buffers', function (done) {
        var port = new SerialPort('/dev/exists');
        port.on('open', function () {
          var data = 'Crazy!';
          port.write(data, function () {
            var lastWrite = port.binding.lastWrite;
            assert.deepEqual(Buffer.from(data), lastWrite);
            done();
          });
        });
      });

      it('test37- converts strings with encodings to buffers', function (done) {
        var port = new SerialPort('/dev/exists');
        port.on('open', function () {
          var data = 'COFFEE';
          port.write(data, 'hex', function () {
            var lastWrite = port.binding.lastWrite;
            assert.deepEqual(Buffer.from(data, 'hex'), lastWrite);
            done();
          });
        });
      });

      it('test38- converts arrays to buffers', function (done) {
        var port = new SerialPort('/dev/exists');
        port.on('open', function () {
          var data = [0, 32, 44, 88];
          port.write(data, function () {
            var lastWrite = port.binding.lastWrite;
            assert.deepEqual(Buffer.from(data), lastWrite);
            done();
          });
        });
      });

      it('test39- queues writes when the port is closed', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.write('data', done);
        port.open();
      });

      it('test40- combines many writes into one', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        var spy = sinon.spy(port.binding, 'write');
        port.open(function () {
          port.cork();
          port.write('abc');
          port.write(Buffer.from('123'), function () {
            assert.equal(spy.callCount, 1);
            assert.deepEqual(port.binding.lastWrite, Buffer.from('abc123'));
            done();
          });
          port.uncork();
        });
      });
    });

    describe('#close', function () {
      it('test41- emits a close event', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          port.on('close', function () {
            assert.isFalse(port.isOpen);
            done();
          });
          port.close();
        });
      });

      it('test42- has a close callback', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          port.close(function () {
            assert.isFalse(port.isOpen);
            done();
          });
        });
      });

      it('test43- emits the close event and runs the callback', function (done) {
        var called = 0;
        var doneIfTwice = function doneIfTwice() {
          called++;
          if (called === 2) {
            return done();
          }
        };
        var port = new SerialPort('/dev/exists', function () {
          port.close(doneIfTwice);
        });
        port.on('close', doneIfTwice);
      });

      it('test44- emits an error event or error callback but not both', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        var called = 0;
        var doneIfTwice = function doneIfTwice(err) {
          assert.instanceOf(err, Error);
          called++;
          if (called === 2) {
            return done();
          }
        };
        port.on('error', doneIfTwice);
        port.close();
        port.close(doneIfTwice);
      });

      it('test45- fires a close event after being reopened', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          var closeSpy = sandbox.spy();
          port.on('close', closeSpy);
          port.close(function () {
            port.open(function () {
              port.close(function () {
                assert.isTrue(closeSpy.calledTwice);
                done();
              });
            });
          });
        });
      });

      it('test46- errors when the port is not open', function (done) {
        var cb = function cb() {};
        var port = new SerialPort('/dev/exists', { autoOpen: false }, cb);
        port.close(function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test47- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'close').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.close(function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test48- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'close').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.close();
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });

    describe('#update', function () {
      it('test49- errors when the port is not open', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.update({}, function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test50- errors when called without options', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        var errors = 0;
        try {
          port.update();
        } catch (e) {
          errors += 1;
          assert.instanceOf(e, TypeError);
        }

        try {
          port.update(function () {});
        } catch (e) {
          errors += 1;
          assert.instanceOf(e, TypeError);
        }
        assert.equal(errors, 2);
        done();
      });

      it('test51- sets the baudRate on the port', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          assert.equal(port.baudRate, 9600);
          port.update({ baudRate: 14400 }, function (err) {
            assert.equal(port.baudRate, 14400);
            assert.isNull(err);
            done();
          });
        });
      });

      it('test52- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'update').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.update({}, function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test53- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'update').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.update({});
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });

    describe('#set', function () {
      it('test54- errors when serialport not open', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.set({}, function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test55- errors without an options object', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        try {
          port.set();
        } catch (e) {
          assert.instanceOf(e, TypeError);
          done();
        }
      });

      it('test56- sets the flags on the ports bindings', function (done) {
        var settings = {
          brk: true,
          cts: true,
          dtr: true,
          dts: true,
          rts: true
        };

        var port = new SerialPort('/dev/exists', function () {
          var spy = sandbox.spy(port.binding, 'set');
          port.set(settings, function (err) {
            assert.isNull(err);
            assert(spy.calledWith(settings));
            done();
          });
        });
      });

      it('test57- sets missing options to default values', function (done) {
        var settings = {
          cts: true,
          dts: true,
          rts: false
        };

        var filledWithMissing = {
          brk: false,
          cts: true,
          dtr: true,
          dts: true,
          rts: false
        };

        var port = new SerialPort('/dev/exists', function () {
          var spy = sandbox.spy(port.binding, 'set');
          port.set(settings, function (err) {
            assert.isNull(err);
            assert(spy.calledWith(filledWithMissing));
            done();
          });
        });
      });

      it('test58- resets all flags if none are provided', function (done) {
        var defaults = {
          brk: false,
          cts: false,
          dtr: true,
          dts: false,
          rts: true
        };

        var port = new SerialPort('/dev/exists', function () {
          var spy = sandbox.spy(port.binding, 'set');
          port.set({}, function (err) {
            assert.isNull(err);
            assert(spy.calledWith(defaults));
            done();
          });
        });
      });

      it('test59- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'set').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.set({}, function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test60- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'set').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.set({});
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });

    describe('#flush', function () {
      it('test61- errors when serialport not open', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.flush(function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test62- calls flush on the bindings', function (done) {
        var port = new SerialPort('/dev/exists');
        var spy = sinon.spy(port.binding, 'flush');
        port.on('open', function () {
          port.flush(function (err) {
            assert.isNull(err);
            assert(spy.calledOnce);
            done();
          });
        });
      });

      it('test63- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'flush').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.flush(function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test64- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'flush').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.flush();
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });

    describe('#drain', function () {
      it('test65- waits for an open port', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.drain(function (err) {
          assert.isNull(err);
          done();
        });
        port.open();
      });

      it('test66- calls drain on the bindings', function (done) {
        var port = new SerialPort('/dev/exists');
        var spy = sinon.spy(port.binding, 'drain');
        port.on('open', function () {
          port.drain(function (err) {
            assert.isNull(err);
            assert(spy.calledOnce);
            done();
          });
        });
      });

      it('test67- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'drain').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.drain(function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test68- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'drain').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.drain();
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test69- waits for in progress or queued writes to finish', function (done) {
        var port = new SerialPort('/dev/exists');
        port.on('error', done);
        var finishedWrite = false;
        port.write(Buffer.alloc(10), function () {
          finishedWrite = true;
        });
        port.drain(function () {
          assert.isTrue(finishedWrite);
          done();
        });
      });
    });

    describe('#get', function () {
      it('test70- errors when serialport not open', function (done) {
        var port = new SerialPort('/dev/exists', { autoOpen: false });
        port.get(function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });

      it('test71- gets the status from the ports bindings', function (done) {
        var port = new SerialPort('/dev/exists', function () {
          var spy = sandbox.spy(port.binding, 'get');
          port.get(function (err, status) {
            assert.isNull(err);
            assert(spy.calledOnce);
            assert.deepEqual(status, {
              cts: true,
              dsr: false,
              dcd: false
            });
            done();
          });
        });
      });

      it('test72- handles errors in callback', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'get').callsFake(function () {
          return Promise.reject(new Error('like tears in the rain'));
        });
        port.on('open', function () {
          port.get(function (err) {
            assert.instanceOf(err, Error);
            done();
          });
        });
      });

      it('test73- handles errors in event', function (done) {
        var port = new SerialPort('/dev/exists');
        sinon.stub(port.binding, 'get').callsFake(function () {
          return Promise.reject(new Error('attack ships on fire off the shoulder of Orion'));
        });
        port.on('open', function () {
          port.get();
        });
        port.on('error', function (err) {
          assert.instanceOf(err, Error);
          done();
        });
      });
    });
  });

  describe('reading data', function () {
    it('test74- emits data events by default', function (done) {
      var testData = Buffer.from('I am a really short string');
      var port = new SerialPort('/dev/exists', function () {
        port.once('data', function (recvData) {
          assert.deepEqual(recvData, testData);
          done();
        });
        port.binding.write(testData);
      });
    });
  });

  describe('disconnect close errors', function () {
    it('test75- emits as a disconnected close event on a bad read', function (done) {
      var port = new SerialPort('/dev/exists');
      sinon.stub(port.binding, 'read').callsFake(function () {
        return Promise.reject(new Error('EBAD_ERR'));
      });
      port.on('close', function (err) {
        assert.instanceOf(err, Error);
        assert.isTrue(err.disconnected);
        done();
      });
      port.on('error', done); // this shouldn't be called
      port.read();
    });
  });
});
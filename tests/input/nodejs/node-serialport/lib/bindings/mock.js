'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug')('serialport:bindings:mock');
var Buffer = require('safe-buffer').Buffer;
var BaseBinding = require('./base');

var ports = {};
var serialNumber = 0;

function resolveNextTick(value) {
  return new Promise(function (resolve) {
    return process.nextTick(function () {
      return resolve(value);
    });
  });
}

var MockBinding = function (_BaseBinding) {
  _inherits(MockBinding, _BaseBinding);

  function MockBinding(opt) {
    _classCallCheck(this, MockBinding);

    var _this = _possibleConstructorReturn(this, (MockBinding.__proto__ || Object.getPrototypeOf(MockBinding)).call(this, opt));

    _this.pendingRead = null; // thunk for a promise or null
    _this.isOpen = false;
    _this.port = null;
    _this.lastWrite = null;
    _this.recording = Buffer.alloc(0);
    _this.writeOperation = null; // in flight promise or null
    return _this;
  }

  // Reset mocks


  _createClass(MockBinding, [{
    key: 'emitData',


    // Emit data on a mock port
    value: function emitData(data) {
      if (!this.isOpen) {
        throw new Error('Port must be open to pretend to receive data');
      }
      if (!Buffer.isBuffer(data)) {
        data = Buffer.from(data);
      }
      debug(this.serialNumber, 'emitting data - pending read:', Boolean(this.pendingRead));
      this.port.data = Buffer.concat([this.port.data, data]);
      if (this.pendingRead) {
        process.nextTick(this.pendingRead);
        this.pendingRead = null;
      }
    }
  }, {
    key: 'open',
    value: function open(path, opt) {
      var _this2 = this;

      debug(null, 'opening path ' + path);
      var port = this.port = ports[path];
      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'open', this).call(this, path, opt).then(resolveNextTick).then(function () {
        if (!port) {
          return Promise.reject(new Error('Port does not exist - please call MockBinding.createPort(\'' + path + '\') first'));
        }
        _this2.serialNumber = port.info.serialNumber;

        if (port.openOpt && port.openOpt.lock) {
          return Promise.reject(new Error('Port is locked cannot open'));
        }

        if (_this2.isOpen) {
          return Promise.reject(new Error('Open: binding is already open'));
        }

        port.openOpt = Object.assign({}, opt);
        _this2.isOpen = true;
        debug(_this2.serialNumber, 'port is open');
        if (port.echo) {
          process.nextTick(function () {
            if (_this2.isOpen) {
              debug(_this2.serialNumber, 'emitting ready data');
              _this2.emitData(port.readyData);
            }
          });
        }
      });
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      var port = this.port;
      debug(this.serialNumber, 'closing port');
      if (!port) {
        return Promise.reject(new Error('already closed'));
      }

      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'close', this).call(this).then(function () {
        delete port.openOpt;
        // reset data on close
        port.data = Buffer.alloc(0);
        debug(_this3.serialNumber, 'port is closed');
        delete _this3.port;
        delete _this3.serialNumber;
        _this3.isOpen = false;
        if (_this3.pendingRead) {
          _this3.pendingRead(new Error('port is closed'));
        }
      });
    }
  }, {
    key: 'read',
    value: function read(buffer, offset, length) {
      var _this4 = this;

      debug(this.serialNumber, 'reading', length, 'bytes');
      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'read', this).call(this, buffer, offset, length).then(resolveNextTick).then(function () {
        if (!_this4.isOpen) {
          throw new Error('Read canceled');
        }
        if (_this4.port.data.length <= 0) {
          return new Promise(function (resolve, reject) {
            _this4.pendingRead = function (err) {
              if (err) {
                return reject(err);
              }
              _this4.read(buffer, offset, length).then(resolve, reject);
            };
          });
        }
        var data = _this4.port.data.slice(0, length);
        var readLength = data.copy(buffer, offset);
        _this4.port.data = _this4.port.data.slice(length);
        debug(_this4.serialNumber, 'read', readLength, 'bytes');
        return readLength;
      });
    }
  }, {
    key: 'write',
    value: function write(buffer) {
      var _this5 = this;

      debug(this.serialNumber, 'writing');
      if (this.writeOperation) {
        throw new Error('Overlapping writes are not supported and should be queued by the serialport object');
      }
      this.writeOperation = _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'write', this).call(this, buffer).then(resolveNextTick).then(function () {
        if (!_this5.isOpen) {
          throw new Error('Write canceled');
        }
        var data = _this5.lastWrite = Buffer.from(buffer); // copy
        if (_this5.port.record) {
          _this5.recording = Buffer.concat([_this5.recording, data]);
        }
        if (_this5.port.echo) {
          process.nextTick(function () {
            if (_this5.isOpen) {
              _this5.emitData(data);
            }
          });
        }
        _this5.writeOperation = null;
        debug(_this5.serialNumber, 'writing finished');
      });
      return this.writeOperation;
    }
  }, {
    key: 'update',
    value: function update(opt) {
      var _this6 = this;

      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'update', this).call(this, opt).then(resolveNextTick).then(function () {
        _this6.port.openOpt.baudRate = opt.baudRate;
      });
    }
  }, {
    key: 'set',
    value: function set(opt) {
      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'set', this).call(this, opt).then(resolveNextTick);
    }
  }, {
    key: 'get',
    value: function get() {
      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'get', this).call(this).then(resolveNextTick).then(function () {
        return {
          cts: true,
          dsr: false,
          dcd: false
        };
      });
    }
  }, {
    key: 'getBaudRate',
    value: function getBaudRate() {
      var _this7 = this;

      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'getBaudRate', this).call(this).then(resolveNextTick).then(function () {
        return {
          baudRate: _this7.port.openOpt.baudRate
        };
      });
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this8 = this;

      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'flush', this).call(this).then(resolveNextTick).then(function () {
        _this8.port.data = Buffer.alloc(0);
      });
    }
  }, {
    key: 'drain',
    value: function drain() {
      var _this9 = this;

      return _get(MockBinding.prototype.__proto__ || Object.getPrototypeOf(MockBinding.prototype), 'drain', this).call(this).then(function () {
        return _this9.writeOperation;
      }).then(function () {
        return resolveNextTick();
      });
    }
  }], [{
    key: 'reset',
    value: function reset() {
      ports = {};
    }

    // Create a mock port

  }, {
    key: 'createPort',
    value: function createPort(path, opt) {
      serialNumber++;
      opt = Object.assign({
        echo: false,
        record: false,
        readyData: Buffer.from('READY')
      }, opt);

      ports[path] = {
        data: Buffer.alloc(0),
        echo: opt.echo,
        record: opt.record,
        readyData: Buffer.from(opt.readyData),
        info: {
          comName: path,
          manufacturer: 'The J5 Robotics Company',
          serialNumber: serialNumber,
          pnpId: undefined,
          locationId: undefined,
          vendorId: undefined,
          productId: undefined
        }
      };
      debug(serialNumber, 'created port', JSON.stringify({ path: path, opt: opt }));
    }
  }, {
    key: 'list',
    value: function list() {
      var info = Object.keys(ports).map(function (path) {
        return ports[path].info;
      });
      return Promise.resolve(info);
    }
  }]);

  return MockBinding;
}(BaseBinding);

module.exports = MockBinding;
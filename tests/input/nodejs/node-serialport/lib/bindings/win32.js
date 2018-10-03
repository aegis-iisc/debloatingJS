'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var binding = require('bindings')('serialport.node');
var BaseBinding = require('./base');
var promisify = require('../util').promisify;
var serialNumParser = require('./win32-sn-parser');

var WindowsBinding = function (_BaseBinding) {
  _inherits(WindowsBinding, _BaseBinding);

  _createClass(WindowsBinding, null, [{
    key: 'list',
    value: function list() {
      return promisify(binding.list)().then(function (ports) {
        // Grab the serial number from the pnp id
        ports.forEach(function (port) {
          if (port.pnpId && !port.serialNumber) {
            var serialNumber = serialNumParser(port.pnpId);
            if (serialNumber) {
              port.serialNumber = serialNumber;
            }
          }
        });
        return ports;
      });
    }
  }]);

  function WindowsBinding(opt) {
    _classCallCheck(this, WindowsBinding);

    var _this = _possibleConstructorReturn(this, (WindowsBinding.__proto__ || Object.getPrototypeOf(WindowsBinding)).call(this, opt));

    _this.bindingOptions = Object.assign({}, opt.bindingOptions || {});
    _this.fd = null;
    _this.writeOperation = null;
    return _this;
  }

  _createClass(WindowsBinding, [{
    key: 'open',
    value: function open(path, options) {
      var _this2 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'open', this).call(this, path, options).then(function () {
        _this2.openOptions = Object.assign({}, _this2.bindingOptions, options);
        return promisify(binding.open)(path, _this2.openOptions);
      }).then(function (fd) {
        _this2.fd = fd;
      });
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'close', this).call(this).then(function () {
        var fd = _this3.fd;
        _this3.fd = null;
        return promisify(binding.close)(fd);
      });
    }
  }, {
    key: 'read',
    value: function read(buffer, offset, length) {
      var _this4 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'read', this).call(this, buffer, offset, length).then(function () {
        return promisify(binding.read)(_this4.fd, buffer, offset, length);
      }).catch(function (err) {
        if (!_this4.isOpen) {
          err.canceled = true;
        }
        throw err;
      });
    }
  }, {
    key: 'write',
    value: function write(buffer) {
      var _this5 = this;

      this.writeOperation = _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'write', this).call(this, buffer).then(function () {
        return promisify(binding.write)(_this5.fd, buffer);
      }).then(function () {
        _this5.writeOperation = null;
      });
      return this.writeOperation;
    }
  }, {
    key: 'update',
    value: function update(options) {
      var _this6 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'update', this).call(this, options).then(function () {
        return promisify(binding.update)(_this6.fd, options);
      });
    }
  }, {
    key: 'set',
    value: function set(options) {
      var _this7 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'set', this).call(this, options).then(function () {
        return promisify(binding.set)(_this7.fd, options);
      });
    }
  }, {
    key: 'get',
    value: function get() {
      var _this8 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'get', this).call(this).then(function () {
        return promisify(binding.get)(_this8.fd);
      });
    }
  }, {
    key: 'getBaudRate',
    value: function getBaudRate() {
      var _this9 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'get', this).call(this).then(function () {
        return promisify(binding.getBaudRate)(_this9.fd);
      });
    }
  }, {
    key: 'drain',
    value: function drain() {
      var _this10 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'drain', this).call(this).then(function () {
        return Promise.resolve(_this10.writeOperation);
      }).then(function () {
        return promisify(binding.drain)(_this10.fd);
      });
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this11 = this;

      return _get(WindowsBinding.prototype.__proto__ || Object.getPrototypeOf(WindowsBinding.prototype), 'flush', this).call(this).then(function () {
        return promisify(binding.flush)(_this11.fd);
      });
    }
  }, {
    key: 'isOpen',
    get: function get() {
      return this.fd !== null;
    }
  }]);

  return WindowsBinding;
}(BaseBinding);

module.exports = WindowsBinding;
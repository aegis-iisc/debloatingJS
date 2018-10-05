'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var binding = require('bindings')('serialport.node');
var BaseBinding = require('./base');
var linuxList = require('./linux-list');
var Poller = require('./poller');
var promisify = require('../util').promisify;
var unixRead = require('./unix-read');
var unixWrite = require('./unix-write');

var defaultBindingOptions = Object.freeze({
  vmin: 1,
  vtime: 0
});

var LinuxBinding = function (_BaseBinding) {
  _inherits(LinuxBinding, _BaseBinding);

  _createClass(LinuxBinding, null, [{
    key: 'list',
    value: function list() {
      return linuxList();
    }
  }]);

  function LinuxBinding(opt) {
    _classCallCheck(this, LinuxBinding);

    var _this = _possibleConstructorReturn(this, (LinuxBinding.__proto__ || Object.getPrototypeOf(LinuxBinding)).call(this, opt));

    _this.bindingOptions = Object.assign({}, defaultBindingOptions, opt.bindingOptions || {});
    _this.fd = null;
    _this.writeOperation = null;
    return _this;
  }

  _createClass(LinuxBinding, [{
    key: 'open',
    value: function open(path, options) {
      var _this2 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'open', this).call(this, path, options).then(function () {
        _this2.openOptions = Object.assign({}, _this2.bindingOptions, options);
        return promisify(binding.open)(path, _this2.openOptions);
      }).then(function (fd) {
        _this2.fd = fd;
        _this2.poller = new Poller(fd);
      });
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'close', this).call(this).then(function () {
        var fd = _this3.fd;
        _this3.poller.stop();
        _this3.poller = null;
        _this3.openOptions = null;
        _this3.fd = null;
        return promisify(binding.close)(fd);
      });
    }
  }, {
    key: 'read',
    value: function read(buffer, offset, length) {
      var _this4 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'read', this).call(this, buffer, offset, length).then(function () {
        return unixRead.call(_this4, buffer, offset, length);
      });
    }
  }, {
    key: 'write',
    value: function write(buffer) {
      var _this5 = this;

      this.writeOperation = _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'write', this).call(this, buffer).then(function () {
        return unixWrite.call(_this5, buffer);
      }).then(function () {
        _this5.writeOperation = null;
      });
      return this.writeOperation;
    }
  }, {
    key: 'update',
    value: function update(options) {
      var _this6 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'update', this).call(this, options).then(function () {
        return promisify(binding.update)(_this6.fd, options);
      });
    }
  }, {
    key: 'set',
    value: function set(options) {
      var _this7 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'set', this).call(this, options).then(function () {
        return promisify(binding.set)(_this7.fd, options);
      });
    }
  }, {
    key: 'get',
    value: function get() {
      var _this8 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'get', this).call(this).then(function () {
        return promisify(binding.get)(_this8.fd);
      });
    }
  }, {
    key: 'getBaudRate',
    value: function getBaudRate() {
      var _this9 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'getBaudRate', this).call(this).then(function () {
        return promisify(binding.getBaudRate)(_this9.fd);
      });
    }
  }, {
    key: 'drain',
    value: function drain() {
      var _this10 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'drain', this).call(this).then(function () {
        return Promise.resolve(_this10.writeOperation);
      }).then(function () {
        return promisify(binding.drain)(_this10.fd);
      });
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this11 = this;

      return _get(LinuxBinding.prototype.__proto__ || Object.getPrototypeOf(LinuxBinding.prototype), 'flush', this).call(this).then(function () {
        return promisify(binding.flush)(_this11.fd);
      });
    }
  }, {
    key: 'isOpen',
    get: function get() {
      return this.fd !== null;
    }
  }]);

  return LinuxBinding;
}(BaseBinding);

module.exports = LinuxBinding;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('serialport:bindings');

/**
 * @name module:serialport.Binding
 * @type {module:serialport~BaseBinding}
 * @since 5.0.0
 * @description The `Binding` is how Node-SerialPort talks to the underlying system. By default, we auto detect Windows, Linux and OS X, and load the appropriate module for your system. You can assign `SerialPort.Binding` to any binding you like. Find more by searching at [npm](https://npmjs.org/).
  Prevent auto loading the default bindings by requiring SerialPort with:
  ```js
  var SerialPort = require('serialport/lib/serialport');
  SerialPort.Binding = MyBindingClass;
  ```
 */

/**
 * You never have to use `Binding` objects directly. SerialPort uses them to access the underlying hardware. This documentation is geared towards people who are making bindings for different platforms. This class can be inherited from to get type checking for each method.
 * @class BaseBinding
 * @param {object} options options for the biding
 * @property {boolean} isOpen Required property. `true` if the port is open, `false` otherwise. Should be read-only.
 * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
 * @since 5.0.0
 */

var BaseBinding = function () {
  _createClass(BaseBinding, null, [{
    key: 'list',

    /**
     * Retrieves a list of available serial ports with metadata. The `comName` must be guaranteed, and all other fields should be undefined if unavailable. The `comName` is either the path or an identifier (eg `COM1`) used to open the serialport.
     * @returns {Promise} resolves to an array of port [info objects](#module_serialport--SerialPort.list).
     */
    value: function list() {
      debug('list');
      return Promise.resolve();
    }
  }]);

  function BaseBinding(opt) {
    _classCallCheck(this, BaseBinding);

    if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) !== 'object') {
      throw new TypeError('"options" is not an object');
    }
  }

  /**
   * Opens a connection to the serial port referenced by the path.
   * @param {string} path the path or com port to open
   * @param {openOptions} options openOptions for the serialport
   * @returns {Promise} Resolves after the port is opened and configured.
   * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
   */


  _createClass(BaseBinding, [{
    key: 'open',
    value: function open(path, options) {
      if (!path) {
        throw new TypeError('"path" is not a valid port');
      }

      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        throw new TypeError('"options" is not an object');
      }
      debug('open');

      if (this.isOpen) {
        return Promise.reject(new Error('Already open'));
      }
      return Promise.resolve();
    }

    /**
     * Closes an open connection
     * @returns {Promise} Resolves once the connection is closed.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'close',
    value: function close() {
      debug('close');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Request a number of bytes from the SerialPort. This function is similar to Node's [`fs.read`](http://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback) except it will always return at least one byte.
    The in progress reads must error when the port is closed with an error object that has the property `canceled` equal to `true`. Any other error will cause a disconnection.
      * @param {buffer} buffer Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
     * @param {integer} offset The offset in the buffer to start writing at.
     * @param {integer} length Specifies the maximum number of bytes to read.
     * @returns {Promise} Resolves with the number of bytes read after a read operation.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'read',
    value: function read(buffer, offset, length) {
      if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('"buffer" is not a Buffer');
      }

      if (typeof offset !== 'number') {
        throw new TypeError('"offset" is not an integer');
      }

      if (typeof length !== 'number') {
        throw new TypeError('"length" is not an integer');
      }

      debug('read');
      if (buffer.length < offset + length) {
        return Promise.reject(new Error('buffer is too small'));
      }

      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Write bytes to the SerialPort. Only called when there is no pending write operation.
    The in progress writes must error when the port is closed with an error object that has the property `canceled` equal to `true`. Any other error will cause a disconnection.
      * @param {buffer} buffer - Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
     * @returns {Promise} Resolves after the data is passed to the operating system for writing.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'write',
    value: function write(buffer) {
      if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('"buffer" is not a Buffer');
      }

      debug('write', buffer.length, 'bytes');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Changes connection settings on an open port. Only `baudRate` is supported.
     * @param {object=} options Only supports `baudRate`.
     * @param {number=} [options.baudRate] If provided a baud rate that the bindings do not support, it should pass an error to the callback.
     * @returns {Promise} Resolves once the port's baud rate changes.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'update',
    value: function update(options) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        throw TypeError('"options" is not an object');
      }

      if (typeof options.baudRate !== 'number') {
        throw new TypeError('"options.baudRate" is not a number');
      }

      debug('update');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Set control flags on an open port.
     * @param {object=} options All options are operating system default when the port is opened. Every flag is set on each call to the provided or default values. All options are always provided.
     * @param {Boolean} [options.brk=false] flag for brk
     * @param {Boolean} [options.cts=false] flag for cts
     * @param {Boolean} [options.dsr=false] flag for dsr
     * @param {Boolean} [options.dtr=true] flag for dtr
     * @param {Boolean} [options.rts=true] flag for rts
     * @returns {Promise} Resolves once the port's flags are set.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'set',
    value: function set(options) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        throw new TypeError('"options" is not an object');
      }
      debug('set');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Get the control flags (CTS, DSR, DCD) on the open port.
     * @returns {Promise} Resolves with the retrieved flags.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'get',
    value: function get() {
      debug('get');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
       * Get the OS reported baud rate for the open port.
       * Used mostly for debugging custom baud rates.
       * @returns {Promise} Resolves with the current baud rate.
       * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
       */

  }, {
    key: 'getBaudRate',
    value: function getBaudRate() {
      debug('getBuadRate');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Flush (discard) data received but not read, and written but not transmitted.
     * @returns {Promise} Resolves once the flush operation finishes.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'flush',
    value: function flush() {
      debug('flush');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }

    /**
     * Drain waits until all output data is transmitted to the serial port. An in progress write should be completed before this returns.
     * @returns {Promise} Resolves once the drain operation finishes.
     * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
     */

  }, {
    key: 'drain',
    value: function drain() {
      debug('drain');
      if (!this.isOpen) {
        return Promise.reject(new Error('Port is not open'));
      }
      return Promise.resolve();
    }
  }]);

  return BaseBinding;
}();

module.exports = BaseBinding;
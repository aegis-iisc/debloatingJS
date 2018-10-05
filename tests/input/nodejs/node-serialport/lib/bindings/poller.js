'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug');
var logger = debug('serialport:poller');
var EventEmitter = require('events');
var FDPoller = require('bindings')('serialport.node').Poller;

var EVENTS = {
  UV_READABLE: 1,
  UV_WRITABLE: 2,
  UV_DISCONNECT: 4
};

function handleEvent(error, eventFlag) {
  if (error) {
    logger('error', error);
    this.emit('readable', error);
    this.emit('writable', error);
    this.emit('disconnect', error);
    return;
  }
  if (eventFlag & EVENTS.UV_READABLE) {
    logger('received "readable"');
    this.emit('readable', null);
  }
  if (eventFlag & EVENTS.UV_WRITABLE) {
    logger('received "writable"');
    this.emit('writable', null);
  }
  if (eventFlag & EVENTS.UV_DISCONNECT) {
    logger('received "disconnect"');
    this.emit('disconnect', null);
  }
}

/**
 * Polls unix systems for readable or writable states of a file or serialport
 */

var Poller = function (_EventEmitter) {
  _inherits(Poller, _EventEmitter);

  function Poller(fd) {
    _classCallCheck(this, Poller);

    logger('Creating poller');

    var _this = _possibleConstructorReturn(this, (Poller.__proto__ || Object.getPrototypeOf(Poller)).call(this));

    _this.poller = new FDPoller(fd, handleEvent.bind(_this));
    return _this;
  }
  /**
   * Wait for the next event to occur
   * @param {string} event ('readable'|'writable'|'disconnect')
   * @returns {Poller} returns itself
   */


  _createClass(Poller, [{
    key: 'once',
    value: function once(event) {
      switch (event) {
        case 'readable':
          this.poll(EVENTS.UV_READABLE);
          break;
        case 'writable':
          this.poll(EVENTS.UV_WRITABLE);
          break;
        case 'disconnect':
          this.poll(EVENTS.UV_DISCONNECT);
          break;
      }
      return EventEmitter.prototype.once.apply(this, arguments);
    }

    /**
     * Ask the bindings to listen for an event, it is recommend to use `.once()` for easy use
     * @param {EVENTS} eventFlag polls for an event or group of events based upon a flag.
     * @returns {undefined}
     */

  }, {
    key: 'poll',
    value: function poll(eventFlag) {
      eventFlag = eventFlag || 0;

      if (eventFlag & EVENTS.UV_READABLE) {
        logger('Polling for "readable"');
      }
      if (eventFlag & EVENTS.UV_WRITABLE) {
        logger('Polling for "writable"');
      }
      if (eventFlag & EVENTS.UV_DISCONNECT) {
        logger('Polling for "disconnect"');
      }

      this.poller.poll(eventFlag);
    }

    /**
     * Stop listening for events and cancel all outstanding listening with an error
     * @returns {undefined}
     */

  }, {
    key: 'stop',
    value: function stop() {
      logger('Stopping poller');
      this.poller.stop();
      var err = new Error('Canceled');
      err.canceled = true;
      this.emit('readable', err);
      this.emit('writable', err);
      this.emit('disconnect', err);
    }
  }]);

  return Poller;
}(EventEmitter);

;

Poller.EVENTS = EVENTS;

module.exports = Poller;
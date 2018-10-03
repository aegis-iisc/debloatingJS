// Mocks fs.read for listLinux

'use strict';

var EventEmitter = require('events');
var proxyquire = require('proxyquire');
var Readable = require('stream').Readable;
var mockPorts = void 0;

proxyquire.noPreserveCache();
var listLinux = proxyquire('../../lib/bindings/linux-list', {
  child_process: {
    spawn: function spawn() {
      var event = new EventEmitter();
      var stream = new Readable();
      event.stdout = stream;
      stream.push(mockPorts);
      stream.push(null);
      return event;
    }
  }
});
proxyquire.preserveCache();

listLinux.setPorts = function (ports) {
  mockPorts = ports;
};

listLinux.reset = function () {
  mockPorts = {};
};

module.exports = listLinux;
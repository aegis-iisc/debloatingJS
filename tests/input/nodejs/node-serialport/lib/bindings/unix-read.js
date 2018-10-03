'use strict';

var fs = require('fs');
var debug = require('debug');
var logger = debug('serialport:unixRead');

module.exports = function unixRead(buffer, offset, length) {
  var _this = this;

  logger('Starting read');
  if (!this.isOpen) {
    return Promise.reject(new Error('Port is not open'));
  }
  return new Promise(function (resolve, reject) {
    fs.read(_this.fd, buffer, offset, length, null, function (err, bytesRead) {
      if (err && (err.code === 'EAGAIN' || err.code === 'EWOULDBLOCK' || err.code === 'EINTR')) {
        if (!_this.isOpen) {
          return reject(new Error('Port is not open'));
        }
        logger('waiting for readable because of code:', err.code);
        _this.poller.once('readable', function (err) {
          if (err) {
            return reject(err);
          }
          resolve(_this.read(buffer, offset, length));
        });
        return;
      }

      var disconnectError = err && (err.code === 'EBADF' || // Bad file number means we got closed
      err.code === 'ENXIO' || // No such device or address probably usb disconnect
      err.code === 'UNKNOWN' || err.errno === -1 // generic error
      );

      if (disconnectError) {
        err.disconnect = true;
        logger('disconnecting', err);
      }

      if (err) {
        return reject(err);
      }

      if (bytesRead === 0) {
        resolve(_this.read(buffer, offset, length));
        return;
      }

      logger('Finished read', bytesRead, 'bytes');
      resolve(bytesRead);
    });
  });
};
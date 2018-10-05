'use strict';

var fs = require('fs');
var debug = require('debug');
var logger = debug('serialport:unixWrite');

module.exports = function unixWrite(buffer, offset) {
  var _this = this;

  offset = offset || 0;
  var bytesToWrite = buffer.length - offset;
  logger('Starting write', buffer.length, 'bytes offset', offset, 'bytesToWrite', bytesToWrite);
  if (!this.isOpen) {
    return Promise.reject(new Error('Port is not open'));
  }
  return new Promise(function (resolve, reject) {
    fs.write(_this.fd, buffer, offset, bytesToWrite, function (err, bytesWritten) {
      logger('write returned', err, bytesWritten);
      if (err && (err.code === 'EAGAIN' || err.code === 'EWOULDBLOCK' || err.code === 'EINTR')) {
        if (!_this.isOpen) {
          return reject(new Error('Port is not open'));
        }
        logger('waiting for writable because of code:', err.code);
        _this.poller.once('writable', function (err) {
          if (err) {
            return reject(err);
          }
          resolve(unixWrite.call(_this, buffer, offset));
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
        logger('error', err);
        return reject(err);
      }

      logger('wrote', bytesWritten, 'bytes');
      if (bytesWritten + offset < buffer.length) {
        if (!_this.isOpen) {
          return reject(new Error('Port is not open'));
        }
        return resolve(unixWrite.call(_this, buffer, bytesWritten + offset));
      }

      logger('Finished writing', bytesWritten + offset, 'bytes');
      resolve();
    });
  });
};
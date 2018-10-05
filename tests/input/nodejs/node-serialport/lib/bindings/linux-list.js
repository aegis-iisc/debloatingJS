'use strict';

var childProcess = require('child_process');
var Readline = require('parser-readline');

// get only serial port names
function checkPathOfDevice(path) {
  return (/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/.test(path) && path
  );
}

function propName(name) {
  return {
    'DEVNAME': 'comName',
    'ID_VENDOR_ENC': 'manufacturer',
    'ID_SERIAL_SHORT': 'serialNumber',
    'ID_VENDOR_ID': 'vendorId',
    'ID_MODEL_ID': 'productId',
    'DEVLINKS': 'pnpId'
  }[name.toUpperCase()];
}

function decodeHexEscape(str) {
  return str.replace(/\\x([a-fA-F0-9]{2})/g, function (a, b) {
    return String.fromCharCode(parseInt(b, 16));
  });
}

function propVal(name, val) {
  if (name === 'pnpId') {
    var match = val.match(/\/by-id\/([^\s]+)/);
    return match && match[1] || undefined;
  }
  if (name === 'manufacturer') {
    return decodeHexEscape(val);
  }
  if (/^0x/.test(val)) {
    return val.substr(2);
  }
  return val;
}

function listLinux() {
  return new Promise(function (resolve, reject) {
    var ports = [];
    var ude = childProcess.spawn('udevadm', ['info', '-e']);
    var lines = ude.stdout.pipe(new Readline());
    ude.on('error', reject);
    lines.on('error', reject);

    var port = {};
    var skipPort = false;
    lines.on('data', function (line) {
      var lineType = line.slice(0, 1);
      var data = line.slice(3);
      // new port entry
      if (lineType === 'P') {
        port = {
          manufacturer: undefined,
          serialNumber: undefined,
          pnpId: undefined,
          locationId: undefined,
          vendorId: undefined,
          productId: undefined
        };
        skipPort = false;
        return;
      }

      if (skipPort) {
        return;
      }

      // Check dev name and save port if it matches flag to skip the rest of the data if not
      if (lineType === 'N') {
        if (checkPathOfDevice(data)) {
          ports.push(port);
        } else {
          skipPort = true;
        }
        return;
      }

      // parse data about each port
      if (lineType === 'E') {
        var keyValue = data.match(/^(.+)=(.*)/);
        if (!keyValue) {
          return;
        }
        var key = propName(keyValue[1]);
        if (!key) {
          return;
        }
        port[key] = propVal(key, keyValue[2]);
      }
    });

    lines.on('finish', function () {
      return resolve(ports);
    });
  });
}

module.exports = listLinux;
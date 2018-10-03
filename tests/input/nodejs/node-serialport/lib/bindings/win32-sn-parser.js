'use strict';

var PARSERS = [/USB\\(?:.+)\\(.+)/, /FTDIBUS\\(?:.+)\+(.+?)A?\\.+/];

module.exports = function (pnpId) {
  if (!pnpId) {
    return null;
  }
  for (var index = 0; index < PARSERS.length; index++) {
    var parser = PARSERS[index];
    var sn = pnpId.match(parser);
    if (sn) {
      return sn[1];
    }
  }
  return null;
};
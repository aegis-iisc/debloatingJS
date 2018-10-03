'use strict';

function promisify(func) {
  if (typeof func !== 'function') {
    throw new Error('"func" must be a function');
  }
  return function () {
    var args = Array.from(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
      func.apply(null, args);
    });
  };
}

module.exports = {
  promisify: promisify
};
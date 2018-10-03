'use strict';

var testConfig = require('../../test-config.json');

global.makeTestFeature = function makeTestFeature(envName) {
  var config = Object.assign({}, testConfig.all, testConfig[envName]);
  return function testFeature(feature, description, callback) {
    if (config[feature] === false) {
      return it('Feature "' + feature + '" is disabled in "' + envName + '. "' + description + '"');
    }
    it(description, callback);
  };
};
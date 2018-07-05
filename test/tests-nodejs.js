var assert = require('assert');
var path = require('path');
var shell = require('shelljs');
var nodejsTestsPath = './tests/input/nodejs',
    projectName = 'sample-project',
    testFileName = 'debloatingJs/__run_tests.js';

describe('execute node.js tests', function () {
   describe('sample application', function () {
       var testFile = path.join(nodejsTestsPath, projectName, testFileName);
       shell.exec('node ' + testFile);
   })
});
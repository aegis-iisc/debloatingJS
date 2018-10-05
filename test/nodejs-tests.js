var assert = require('assert');
var path = require('path');
var shell = require('shelljs');
const commons = require("../commons.js");

var nodejsTestsPath = './tests/input/nodejs',
    testFileName = 'debloatingJS/__run_tests.js';


// /debloatingJS/__run_Test.js == appName
function runNodeTests (appName) {

    it('run jalangi', function () {
        var exitCode = commons.jalangiAnalysis('CheckModuleLoading', appName, null, true);
        assert.equal(exitCode, 0);
    });
    // compare actual and expected JSON files generated by the dynamic analysis phase
    /* it('compare outputs', function () {
         commons.compareOutputs(testName, 'unit');
     });
 */
    it('run both phases', function (){
        console.log("Running bothe the phases for "+appName);
        var exitCode = commons.runBothPhases(appName, true);
        assert.equal(exitCode, 0);
    });

    it('verify instrumented app execution on initial tests', function (done) {
        //TODO handle nodejs case for getOriginal and getModified
        var originalFile = commons.getOriginalPathOrDir(appName, false);
        var modifiedFile = commons.getModifiedPathOrDir(appName, false);
        commons.interceptAppExecution(originalFile, modifiedFile, [], done);
    });
    it('verify instrumented app execution on remaining tests', function (done) {
        //TODO handle nodejs case for getOriginal and getModified
        var originalFile = commons.getOriginalPathOrDir(commons.remainingTest(appName), false);
        var modifiedFile = commons.getModifiedPathOrDir(commons.remainingTest(appName), false);
        commons.interceptAppExecution(originalFile, modifiedFile, [], done);
    });
}


/*

describe('execute node.js tests', function () {
   describe('sample application', function () {
       var testFile = path.join(nodejsTestsPath, projectName, testFileName);
       console.log("before execution");
       console.log("TestFile "+testFile);
       shell.exec('node ' + testFile);
   })
});
*/


describe('all tests for nodejs', function () {
    this.timeout(200000);

  /*  describe('sample application', function () {
        var testFile = path.join(nodejsTestsPath, projectName, testFileName);
        console.log("TestFile "+testFile);
        runNodeTests(testFile);
        //shell.exec('node ' + testFile);
    });
*/
    /*describe('sample application 2', function () {
        var testFile = path.join(nodejsTestsPath, projectName, testFileName);
        console.log("TestFile "+testFile);
        runNodeTests(testFile);
        //shell.exec('node ' + testFile);
    });
    */

    projectName = 'loader-runner';
    var testFile = path.join(nodejsTestsPath, projectName, testFileName);
    describe(projectName + ' application', function () {
        runNodeTests(testFile);
    });

    projectName = 'node-directory-tree';
    var testFile = path.join(nodejsTestsPath, projectName, testFileName);
    describe(projectName + ' application', function () {
        runNodeTests(testFile);
    })

});
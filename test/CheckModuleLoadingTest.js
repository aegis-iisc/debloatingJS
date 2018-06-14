var assert = require('assert');
const commons = require("../commons.js");


function runTests (testName, isNode) {

    it('check-exit-jalangi-execution', function () {

        var exit = commons.jalangiAnalysis('CheckModuleLoading', testName);
        assert(exit === 0);
    });

    it('check-size-loaded-functions', function () {
        var size = commons.verifyGeneratedLoaded(testName, false);
        console.log("size "+size);
        assert(size !== 0); // TODO compare contents of two files
    });

    // TODO this can be removed
/*    it('check-size-executed-functions', function () {
        // pass the fileName and a boolean stat
        var size = commons.verifyGeneratedExecuted(testName, false);
        console.log("size "+size);
        assert(size !== 0);

    });
*/
    it('check-size-stubList', function () {
        // pass the fileName and a boolean stat
        var size = commons.verifyGeneratedStubList(testName, false);
        console.log("size "+size);
        assert(size !== 0); // TODO compare contents of two files
    });

    // TODO merge the next two tests
    it('check-exit-code-Main-run-unit', function () {
        if(!isNode) {
            var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName + '.js', '--transformer S2STransformer.js ']);
            assert(exit === 0);
        }else{// node csae to be handled later
            assert(true);
        }
    });

    it('check-exit-code-Main-run-dir', function () {
        if(!isNode) {
            var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir ' + testName + '.js', '--transformer S2STransformer.js']);
            assert(exit === 0);
        }else{
            assert(true);
        }

    });
    // TODO move to separate file
/*
    it('check-exit-code-Main-run-node', function () {
        if (isNode) {// handle later
              var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir ' + testName + '.js', '--transformer S2STransformer.js', '--node']);
                assert(exit === 0);
        }else
            assert(true);
    });
*/
    // TODO next two tests are unnecessary
    /*
    // check the output and the error for the Main
    it('check-output-Main-run-unit', function () {

        var stdout = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile '+testName, '--transformer S2STransformer.js'], 'stdout');
        console.log("stdout "+stdout);
        assert(stdout === 0); //  assert something over the stdout, e.g. compare with the expected output

    });

    it('check-error-Main-run-unit', function () {

        var stderr = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile '+testName, '--transformer S2STransformer.js'], 'stderr');
        assert(stderr === 0);

    });
    */

/*
    it('check-output-Main-run-dir', function () {

        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir '+testName, '--transformer S2STransformer.js']);
        assert(exit === 0);

    });
    it('check-output-Main-run-node', function () {

        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir test2', '--transformer S2STransformer.js'], );
        assert(exit === 0);

    });
*/
    // Checks over the transformed Application
    it('check-exit-by-executing-transformed-application', function (){

        var modifiedTestName = commons.getModifiedPathOrDir(testName, isNode);
        var exit = commons.runWithNode(modifiedTestName, []);
        assert(exit === 0);
    });


    // TODO compare actual output
    it('check-out-by-executing-transformed-application', function (){
        var modifiedTestName = commons.getModifiedPathOrDir(testName, isNode);
        var stdout = commons.runWithNode(modifiedTestName, [], 'stdout');
        console.log("OUT "+stdout);
    });

    // TODO compare actual errors
    it('check-error-by-executing-transformed-application', function (){
        var modifiedTestName = commons.getModifiedPathOrDir(testName, isNode);
        var stderr = commons.runWithNode(modifiedTestName, [], 'stderr');
        console.log("ERROR "+stderr);
        //assert(exit === 0);

    });


/*
    it('compare-size-original-transformed', function (){

    });

    // idependent tests
    // independently running the transformer
    it('check-exit-code-Transformer-execution-independent', function () {

        var exitcode = commons.runTransformer('./analysis/src/S2STransformer.js', 'testName_stubList.json', './tests', './tests/output-actual/unit/');
        assert(exitcode === 0);
    });
*/
}


runTests('test1');

/*
describe('unit-tests', function () {
    describe('test1', function () {
        runTests('test1');
    });
    describe('test2', function () {
        runTests('test2');
    });
});






describe('simplest', function() {
  describe('successful execution of module', function() {
    it('should run with exit 0', function() {
      // the command for running the test case goes here
      commons.runTest("abc");

    });
  });
});
// checks correct jalangi -execution
describe('CheckModuleLoading', function() {
    it('should run with exit 0', function() {
        // the command for running the test case goes here
        //var inputFile
        commons.runNode('./tests/test-loading-semantics.js');
    });
});
// checks size of the stubList generated
describe('CheckModuleLoading', function () {
    it('size of stubList.json must be greater than 0', function () {
        var length = commons.runJalangi('CheckModuleLoading', 'test-loading-semantics.js');
        if(length !== -1)
            assert(length > 0, 'Either Stub generation failed or No uncovered function');
        else
            assert(length === 0, 'Jalangi Execution Failed');
    });
});


// Add Test case for running Jalangi over an application and a set of testcases



describe('S2STransformer', function () {
    it('S2STransformer executes successfully', function () {
        commons.runTransformer('./analysis/S2STransformer.js', 'stubList.json', './tests', './tests/output-actual/unit/');

    });
});

// test running the generated code
describe('IN : exported_circle_second_modified', function () {
    it('modified function successfully executes', function () {
        try{
            commons.runWithNode('./scribble/tests/exported_circle_second_modified.js', []);
            assert(true);
        }catch (e){
            console.log(e.message);
            assert(false);
        }
    });
});

describe('test-loading-semantics', function () {
    it('generated code successfully executes, no call to removed function', function () {
        try{
            var exit = commons.runWithNode('./tests/test-loading-semantics.js', []);
            assert(exit === 0);
        }catch (e){
            console.log(e.message);
            assert(false);
        }
    });
});

describe('test-loading-semantics_modified Scribble', function () {
   it('generated code should successfully executes, call to a dynamically loaded function', function () {
       try{
        var exit = commons.runWithNode('./scribble/tests/test-loading-semantics_modified.js', []);
        assert(exit === 0);
       }catch (e){
           console.log(e.message);
           assert(false);
       }
   });
});


// Individual Test for updating require statements.
describe('IN : createupdatedrequire', function () {
    it('output js file should update the required modules to the modified version', function () {
         var exit =commons.runWithNode('./scribble/createupdatedrequire.js', []);
         assert(exit === 0);

    });
});



describe('Main1', function () {
    it('run whole debloater over a unit test in /tests/input/file.js', function () {
        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile test-loading-semantics.js', '--transformer S2STransformer.js ']);
        assert(exit === 0);

    });
});



describe('Main2', function () {
    it('run whole debloater over a directory structure in /tests/input/unit', function () {
        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir test2', '--transformer S2STransformer.js']);
        assert(exit === 0);

    });
});


describe('Main2.1', function () {
    it('run whole debloater over a directory structure in /tests/input/unit checks the correct directory structure formation', function () {
        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputDir test2', '--transformer S2STransformer.js']);
        assert(exit === 0);

    });
});

describe('Main3', function () {
    it('run whole debloater over a nodejs app in /tests/input/nodejs', function () {
        var exit = commons.runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile test-loading-semantics.js', '--transformer S2STransformer.js', '--node true']);
        assert(exit === 0);

    });
});


// compare simple textual difference
describe('require parameters update', function () {
    it('output js file should update the required modules to the modified version', function () {
        var exit = commons.runTextDiff('./tests/output-actual/unit/exported_circle_second_modified.js', './tests/output-expected/unit/exported_circle_second_modified.js');
        assert(exit === 0);

    });
});


*/



// what are the artifacts
// test case for jalangi create current and expected outputs and assert for their equality.
// use the exit code from the shelljs to check for successful execution.

//
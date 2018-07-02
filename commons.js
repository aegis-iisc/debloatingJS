// get the $Jalangi_Home from the environment
var shelljs = require('shelljs');
var fs = require('fs');
var utf8 = require('utf8');
var assert = require('assert');
var exec = require('child_process').exec;

//const $jalangi_home =
//shell.env

const $nodePath = process.env.NODE_PATH;
const $JALANGI_HOME = process.env.JALANGI_HOME;

var exports = module.exports = {};
function runTest(fileName){
    console.log("Running test");
    //runJalangiAnalysis(fileName);


}

exports.runNode = function (fileName){

   var fileName = fileName;
   var jalangiExecString = '';
   jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
   jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
   jalangiExecString = jalangiExecString + ' --analysis analysis/src/CheckModuleLoading.js';
   jalangiExecString = jalangiExecString +' '+ fileName;

   //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
   shelljs.exec(jalangiExecString);
};

function runWithNode (fileName, args, output){
    var params = '';
    for(nextparam in args){
        params = params+args[nextparam]+ ' ';
    }
    var nodeExecString = '';
    nodeExecString = nodeExecString + $nodePath + ' ' +fileName;
    nodeExecString = nodeExecString + ' ' +params;
    if(!output || output === 'exit' ) {
        var exitcode = shelljs.exec(nodeExecString).code;
        console.log(exitcode);
        return exitcode;
    }else if (output === 'stdout'){
        var stdout = shelljs.exec(nodeExecString).stdout;
        return stdout;
    }else if(output === 'stderr'){
        var stderr = shelljs.exec(nodeExecString).stderr;
        return stderr;


    }else{
        console.error("Invalid Output Type");
        return -1;
    }
}

function retrieveCommand (fileName, params) {
    var command = '';
    for (var paramIndex in params) {
        command = command + params[paramIndex] + ' ';
    }
    command = $nodePath + ' ' + fileName + ' ' + command;
    return command;
}

/**
 * Execute the application under test before and after instrumentation and compare results
 * @param originalFileName
 * @param modifiedFileName
 * @param params
 * @param done
 */
function interceptAppExecution (originalFileName, modifiedFileName, params, done) {
    var originalExecution = retrieveCommand(originalFileName, params);
    var modifiedExecution = retrieveCommand(modifiedFileName, params);
    try {
        // execute original application and store output
        exec(originalExecution, function (error, stdout, stderr) {
            assert.ifError(error);
            var originalResults = {
                stdout: stdout,
                stderr: stderr,
                error: error
            };
            // execute modified application and compare output
            exec(modifiedExecution, function (mError, mStdout, mStderr) {
                assert.ifError(mError);
                assert.equal(originalResults.stdout, mStdout);
                assert.equal(originalResults.stderr, mStderr);
                done();
            })
        });
    }
    catch (error) {
        console.err(error);
    }
}

exports.interceptAppExecution = interceptAppExecution;
exports.runWithNode = runWithNode;



/**
 * A function to run Jalangi analysis from the program
 * @param jalangiAnalysis
 * @param inputfile to Jalangi
 * @param root dir for the inputfile
 *
 */
exports.runJalangi = function (analysis, inputFile, testsRoot){

    var testroot = null;
    if(!testsRoot) {
        console.log("testRoot Not defined")
        testroot = './tests/input/unit/';
    }else{
        testroot = testsRoot;
    }
    var srcdir = './analysis/src/';
    var jalangiExecString = '';
    jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
    jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
    jalangiExecString = jalangiExecString + ' --analysis '+srcdir+analysis;
    jalangiExecString = jalangiExecString +' '+testroot+inputFile;

    //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
    var exitCode = shelljs.exec(jalangiExecString).code;

    return exitCode;

};
//TODO Change it to two different phases with assertions in between
exports.runBothPhases = function (testName, isNode){
    if(!isNode) {
        var exitcode = runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName + '.js', '--transformer S2STransformer.js']);
        return exitcode;
    }else{
        assert(false);
    }
};


exports.jalangiAnalysis = function (analysis, inputFile, testsRoot){

    var testroot = null;
    if(!testsRoot) {
        console.log("testRoot Not defined")
        testroot = './tests/input/unit/';
    }else{
        testroot = testsRoot;
    }
    var srcdir = './analysis/src/';
    var jalangiExecString = '';
    jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
    jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
    jalangiExecString = jalangiExecString + ' --analysis '+srcdir+analysis;
    jalangiExecString = jalangiExecString +' '+testroot+inputFile;

    //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
    var exitCode = shelljs.exec(jalangiExecString).code;
    return exitCode;

};
function verifyGeneratedLoaded(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/';
    else
        var testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var loadedJSONFile_actual = output_actualRoot+testName+'_loadedfunctions.json';
    var loadedJSONFile_expected = output_expectedRoot+testName+'_loadedfunctions.json';

   /* var writtentLoadedFunctions_actual = fs.readFileSync(loadedJSONFile_actual);
    var writtentLoadedFunctions_expected = fs.readFileSync(loadedJSONFile_expected);
*/
    var diffCode = this.runTextDiff(loadedJSONFile_actual, loadedJSONFile_expected);
    console.log("Diff-Code "+diffCode);
    return diffCode === 0 ? true : false;
      //return writtentLoadedFunctions.length;

}

exports.verifyGeneratedLoaded = verifyGeneratedLoaded;


function compareLoadedWithExpected(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/';
    else
        var testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var loadedJSONFile_actual = output_actualRoot+testName+'_loadedfunctions.json';
    var JSONFile_expected = output_expectedRoot+testName+'_persistent.json';

    var actualLoadedObj = JSON.parse(fs.readFileSync(loadedJSONFile_actual, 'utf8'));
    var expectedLoadedObj = JSON.parse(fs.readFileSync(JSONFile_expected, 'utf8')).loadedfunctions;

    console.log("actual "+actualLoadedObj);
    console.log("expected "+expectedLoadedObj);
    return assert.deepStrictEqual(actualLoadedObj, expectedLoadedObj, "Actual and Expected mismatch");


}

exports.compareLoadedWithExpected = compareLoadedWithExpected;


function compareExecutedWithExpected(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/';
    else
        var testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var invokedJSONFile_actual = output_actualRoot+testName+'_invokedfunctions.json';
    var JSONFile_expected = output_expectedRoot+testName+'_persistent.json';

    var actualInvokedObj = JSON.parse(fs.readFileSync(invokedJSONFile_actual, 'utf8'));
    var expectedInvokedObj = JSON.parse(fs.readFileSync(JSONFile_expected, 'utf8')).invokedfunctions;

    return assert.deepStrictEqual(actualInvokedObj, expectedInvokedObj, "Actual and Expected mismatch");

}

exports.compareExecutedWithExpected = compareExecutedWithExpected;


function compareStubWithExpected(testName, isNode){
    var testRoot;
    if(!isNode)
        testRoot = './tests/input/unit/';
    else
        testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var stubListJSONFile = output_actualRoot+testName+'_stubList.json';
    var JSONFile_expected = output_expectedRoot+testName+'_persistent.json';

    var actualStubListObj = JSON.parse(fs.readFileSync(stubListJSONFile, 'utf8'));
    console.log(actualStubListObj);

    var expectedStubListObj = JSON.parse(fs.readFileSync(JSONFile_expected, 'utf8')).stubList;
    console.log(expectedStubListObj);
    assert.deepStrictEqual(actualStubListObj, expectedStubListObj, "Actual and Expected mismatch");
}

exports.compareStubWithExpected = compareStubWithExpected;


function verifyGeneratedExecuted(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/';
    else
        var testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var invokedJSONFile_actual = output_actualRoot+testName+'_invokedfunctions.json';
    var invokedJSONFile_expected = output_expectedRoot+testName+'_invokedfunctions.json';

    /* var writtentLoadedFunctions_actual = fs.readFileSync(loadedJSONFile_actual);
     var writtentLoadedFunctions_expected = fs.readFileSync(loadedJSONFile_expected);
 */
    var diffCode = this.runTextDiff(invokedJSONFile_actual, invokedJSONFile_expected);
    console.log("Diff-Code "+diffCode);
    return diffCode === 0 ? true : false;

//      return writtentInvokedFunctions.length;

}

exports.verifyGeneratedExecuted = verifyGeneratedExecuted;

function verifyGeneratedStubList(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/'
    else
        var testRoot = './tests/input/nodejs/'

    var outputRoot = testRoot.replace('input', 'output-actual');
    var stubListJSONFile = outputRoot+testName+'_stubList.json';
    var stubList = fs.readFileSync(stubListJSONFile);

    return stubList.length;

}

exports.verifyGeneratedStubList = verifyGeneratedStubList;





function runTrasformer(transofrmer, sl, inp, outp ){


    console.log("sl "+sl);
    console.log("inp "+inp);
    console.log("outp "+outp);
    return runWithNode(transofrmer, ['-sl '+sl, '-in '+inp, '-o '+outp]);


}



function runTextDiff(js1, js2){

    var diffExecString = '/usr/bin/diff ';
    diffExecString = diffExecString + js1 + ' ';
    diffExecString = diffExecString +  js2

    var exitCode = shelljs.exec(diffExecString).code;
    return exitCode; // 0 = no difference, 1 = difference occurred >1 = error

}

// returns the path for the modified file or application directory
function getModifiedPathOrDir(inputName, isNode){
    if(!isNode){

        var testRoot = './tests/input/unit/';
        var outputRoot = testRoot.replace('input', 'output-actual');
        var outputMofied = outputRoot+inputName+'_modified.js';
        console.log("output FIle Path "+outputMofied);

        return outputMofied;


            }else{ // TODO :: nodejs application case

        return '';
    }


}

exports.getModifiedPathOrDir = getModifiedPathOrDir;
// returns the path for the modified file or application directory
function getOriginalPathOrDir(inputName, isNode){
    if(!isNode){

        var testRoot = './tests/input/unit/';
        var originalFile = testRoot+inputName+'.js';

        return originalFile;


    }else{ // TODO :: nodejs application case

        return '';
    }


}

exports.getOriginalPathOrDir = getOriginalPathOrDir;




/*
exports.runS2STransfromer = function (){



}
*/
exports.runTextDiff = runTextDiff;
exports.runTest = runTest;
exports.runTransformer = runTrasformer;
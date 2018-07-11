var shelljs = require('shelljs');
var fs = require('fs');
var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');

// get the $Jalangi_Home from the environment
const $JALANGI_HOME = process.env.JALANGI_HOME;
const $nodePath = process.env.NODE_PATH;

const actualOutputPath = path.resolve('./tests/output-actual/');
const expectedOutputPath = path.resolve('./tests/output-expected/');
const inputPath = path.resolve('./tests/input');

function runWithNode (fileName, args, output){
    var params = '';
    for(var nextparam in args){
        params = params+args[nextparam]+ ' ';
    }
    var nodeExecString = '';
    nodeExecString = nodeExecString + $nodePath + ' ' +fileName;
    nodeExecString = nodeExecString + ' ' +params;

    console.log("executing "+nodeExecString);
    if(!output || output === 'exit' ) {
        return shelljs.exec(nodeExecString).code;
    } else if (output === 'stdout'){
        return shelljs.exec(nodeExecString).stdout;
    } else if(output === 'stderr'){
        return shelljs.exec(nodeExecString).stderr;
    } else{
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
                console.log("*** Original and Modified execution asserted ***");
                done();
            })
        });
    }
    catch (error) {
        console.err(error);
    }
}

/**
 * A function to run Jalangi analysis from the program
 * @param jalangiAnalysis
 * @param inputfile to Jalangi
 * @param root dir for the inputfile
 *
 */
function runJalangi (analysis, inputFile, testsRoot){
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
    return shelljs.exec(jalangiExecString).code;
}

//TODO Change it to two different phases with assertions in between
function runBothPhases (testName, isNode) {
    if(!isNode) {
        return runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName + '.js', '--transformer S2STransformer.js']);
    } else{
        assert(false);
    }
}

function jalangiAnalysis (analysis, inputFile, testsRoot){
    var testroot = null;
    if(!testsRoot) {
        testroot = './tests/input/unit/';
    } else{
        testroot = testsRoot;
    }
    var srcdir = './analysis/src/';
    var jalangiExecString = '';
    jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
    jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
    jalangiExecString = jalangiExecString + ' --analysis '+srcdir+analysis;
    jalangiExecString = jalangiExecString +' '+testroot+inputFile;

    return shelljs.exec(jalangiExecString).code;
}

/**
 * This function compares the outcome of the first phase of analysis with the expected output
 * The output should contain a json object,
 * which consists of list of loaded functions as well as a list of un-executed functions
 * @param testName
 * @param testType
 */
function compareOutputs (testName, testType) {
    var actualOutputFile = path.resolve(actualOutputPath, testType, testName + '_out.json');
    var expectedOutputFile = path.resolve(expectedOutputPath, testType, testName + '_out.json');


    var actualOutput = JSON.parse(fs.readFileSync(actualOutputFile));
    var expectedOutput = JSON.parse(fs.readFileSync(expectedOutputFile));

    return assert.deepStrictEqual(actualOutput, expectedOutput, "Actual and Expected Mismatch");
}

function runTransformer(transformer, sl, inp, outp ){
    console.log("sl "+sl);
    console.log("inp "+inp);
    console.log("outp "+outp);
    return runWithNode(transformer, ['-sl '+sl, '-in '+inp, '-o '+outp]);
}

// returns the path for the modified file or application directory
function getModifiedPathOrDir(inputName, isUnit) {
    if (isUnit) {
        return path.resolve(actualOutputPath, 'unit', inputName + '_modified.js');
    }
    else { // TODO :: nodejs application case
        return '';
    }
}

// returns the path for the modified file or application directory
function getOriginalPathOrDir(inputName, isUnit){
    if (isUnit) {
        return path.resolve(inputPath, 'unit', inputName + '.js');
    }
    else {
        // TODO :: nodejs application case
        return '';
    }
}

module.exports = {
    interceptAppExecution: interceptAppExecution,
    compareOutputs: compareOutputs,
    jalangiAnalysis: jalangiAnalysis,
    runBothPhases: runBothPhases,
    runJalangi: runJalangi,
    runTransformer: runTransformer,
    getOriginalPathOrDir: getOriginalPathOrDir,
    getModifiedPathOrDir: getModifiedPathOrDir
};
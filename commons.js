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

    console.log("commons.runWithNode :: executing "+nodeExecString);
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
        console.log(">>>" +originalExecution);
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
        console.err('Error '+error);
    }
}

/**
 * A function to run Jalangi analysis from the program
 * @param jalangiAnalysis
 * @param inputfile to Jalangi
 * @param root dir for the inputfile
 *
 */
function runJalangi (analysis, inputFile, testsRoot, isNode){
    var testroot = null;
    if(!testsRoot || testsRoot == null) {
        console.log("testRoot Not defined")
        testroot = './tests/input/unit/';
    }else{
        testroot = testsRoot;
    }
    var srcdir = './analysis/src/';
    if(!isNode || isNode === false) {
        var jalangiExecString = '';
        jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
        jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
        jalangiExecString = jalangiExecString + ' --analysis ' + srcdir + analysis;
        jalangiExecString = jalangiExecString + ' ' + testroot + inputFile;

        //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
        return shelljs.exec(jalangiExecString).code;
    }else{

        // node js case handling
        // Case , application/jsDebloat/__run_tests.js is the input file for nodejs case.
        console.log("Running Dynamic reachability Analysis for application "+inputFile);
        var jalangiExecStringForNode = '';
        jalangiExecStringForNode = jalangiExecStringForNode + $nodePath + ' '+'--max_old_space_size=2000000' +' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
        jalangiExecStringForNode = jalangiExecStringForNode + ' --inlineIID --inlineSource';
        jalangiExecStringForNode = jalangiExecStringForNode + ' --analysis ' + srcdir + analysis;
        jalangiExecStringForNode = jalangiExecStringForNode + ' ' + inputFile;

        console.log("Jalangi running String "+jalangiExecStringForNode);
        return shelljs.exec(jalangiExecStringForNode).code;



    }
}

//TODO Change it to two different phases with assertions in between
function runBothPhases (testName, isNode) {
    var testFile = path.resolve(testName);
    var ext = path.extname(testFile);

    if(!isNode) {
        if(ext.toString() === '.js') {
            console.log("A JS FILE ");
            return runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName, '--transformer S2STransformer.js', '--node true']);
        }else {
            return runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName + '.js', '--transformer S2STransformer.js']);
        }
    } else{
        if(ext.toString() === '.js') {
            console.log("A JS FILE ");
            return runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName, '--transformer S2STransformer.js', '--node true']);
        }else {
            return runWithNode('./analysis/src/Main.js', ['--analysis CheckModuleLoading.js', '--inputFile ' + testName + '.js', '--transformer S2STransformer.js', '--node true']);
        }
        // for node case also pass the appication parameter to the Main.js
        //assert(false);
    }
}

function jalangiAnalysis (analysis, inputFile, testsRoot, isNode){
    var testroot = null;
    var srcdir = './analysis/src/';
    if(!isNode || isNode === false) {
        if (!testsRoot) {
            testroot = './tests/input/unit/';
        } else {
            testroot = testsRoot;
        }
        var jalangiExecString = '';
        jalangiExecString = jalangiExecString + $nodePath + ' ' +'--max_old_space_size=2000000' +' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
        jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
        jalangiExecString = jalangiExecString + ' --analysis ' + srcdir + analysis;
        jalangiExecString = jalangiExecString + ' ' + testroot + inputFile;

        return shelljs.exec(jalangiExecString).code;
    }else{ // node js case handling
        // Case , application/jsDebloat/__run_tests.js is the input file for nodejs case.
        console.log("Running Dynamic reachability Analysis for application "+inputFile);
        var jalangiExecStringForNode = '';
        jalangiExecStringForNode = jalangiExecStringForNode + $nodePath + ' '+'--max_old_space_size=2000000' +' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
        jalangiExecStringForNode = jalangiExecStringForNode + ' --inlineIID --inlineSource';
        jalangiExecStringForNode = jalangiExecStringForNode + ' --analysis ' + srcdir + analysis;
        jalangiExecStringForNode = jalangiExecStringForNode + ' ' + inputFile;

        console.log("Jalangi running String "+jalangiExecStringForNode);
        return shelljs.exec(jalangiExecStringForNode).code;


    }
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
/*
    A utility function to fire the src/S2STransformer.js
    @param path to the S2STransormer file to be passed to node
    @param

 */
function runTransformer(transformer, sl, inp, outp, isNode ){
    console.log("sl "+sl);
    console.log("inp "+inp);
    console.log("outp "+outp);
    return runWithNode(transformer, ['-sl '+sl, '-in '+inp, '-o '+outp, '-isNode '+isNode]);
}

// returns the path for the modified file or application directory
function getModifiedPathOrDir(inputName, isUnit) {
    if (isUnit) {
        return path.resolve(actualOutputPath, 'unit', inputName + '.js');
    }
    else { // TODO :: nodejs application case
        var outputName = inputName.toString().replace('input', 'output-actual');
        var pathModified = path.resolve(outputName);
        return pathModified;
    }
}

// returns the path for the modified file or application directory
function getOriginalPathOrDir(inputName, isUnit){
    if (isUnit) {
        return path.resolve(inputPath, 'unit', inputName + '.js');
    }
    else {
        // TODO :: nodejs application case
        var pathOriginal = path.resolve(inputName);
        return pathOriginal;
    }
}

function remainingTest(mainTestFilePath){
    return path.resolve(path.dirname(mainTestFilePath), '__run_remaining_tests.js');
}

function getMemberExpressionName(pathStart){
    var prefix ='';
    var node = pathStart;
    while (node.type === "MemberExpression"){
        prefix = '.'+node.property.name +prefix;
        node = node.object;
    }
    if(node.type === "Identifier"){ // terminal case
        prefix = node.name+prefix;
    }
    return prefix;
}

function logErrorToFile(error, file){

    try{
       var errorFile =  path.resolve(file);
       fs.appendFileSync(errorFile, error.stack);
    }catch (err){
        console.error(err.stack);
        throw err;
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
    getModifiedPathOrDir: getModifiedPathOrDir,
    remainingTest : remainingTest,
    getMemberExpressionName :getMemberExpressionName,
    logErrorToFile : logErrorToFile

};
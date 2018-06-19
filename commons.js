

// get the $Jalangi_Home from the environment
var shelljs = require('shelljs');
var fs = require('fs')
var utf8 = require('utf8');
var assert = require('assert');

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

exports.runWithNode = runWithNode;

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

    console.log("actual path "+loadedJSONFile_actual);
    console.log("expected path "+JSONFile_expected);
    var actualLoadedObj = JSON.parse(fs.readFileSync(loadedJSONFile_actual, 'utf8'));
    var expectedLoadedObj = JSON.parse(fs.readFileSync(JSONFile_expected, 'utf8')).loadedfunctions;
    console.log(actualLoadedObj);
    console.log(expectedLoadedObj);

    var output = assert.deepEqual(actualLoadedObj, expectedLoadedObj, "Actual and Expected mismatch");
    console.log(output);

    // load json objects and compare
    return 1;

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

    var output = assert.deepEqual(actualInvokedObj, expectedInvokedObj, "Actual and Expected mismatch");
    console.log(output);

    // load json objects and compare
    return 1;

}

exports.compareExecutedWithExpected = compareExecutedWithExpected;


function compareStubWithExpected(testName, isNode){
    if(!isNode)
        var testRoot = './tests/input/unit/';
    else
        var testRoot = './tests/input/nodejs/';

    var output_actualRoot = testRoot.replace('input', 'output-actual');
    var output_expectedRoot = testRoot.replace('input', 'output-expected');
    var stubListJSONFile = output_actualRoot+testName+'_stubList.json';
    var JSONFile_expected = output_expectedRoot+testName+'_persistent.json';

    var actualStubListObj = JSON.parse(fs.readFileSync(invokedJSONFile_actual, 'utf8'));
    var expectedStubListObj = JSON.parse(fs.readFileSync(JSONFile_expected, 'utf8')).stubList;

    var output = assert.deepEqual(actualStubListObj, expectedStubListObj, "Actual and Expected mismatch");
    console.log(output);

    // load json objects and compare
    return 1;

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

        var testRoot = './tests/input/unit/'
        var outputRoot = testRoot.replace('input', 'output-actual');
        var outputMofied = outputRoot+inputName+'_modified.js';
        console.log("output FIle Path "+outputMofied);

        return outputMofied;


            }else{ // TODO :: nodejs application case

        return '';
    }


}

exports.getModifiedPathOrDir = getModifiedPathOrDir;

/*
exports.runS2STransfromer = function (){



}
*/
exports.runTextDiff = runTextDiff;
exports.runTest = runTest;
exports.runTransformer = runTrasformer;
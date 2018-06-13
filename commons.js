

// get the $Jalangi_Home from the environment
var shelljs = require('shelljs');
var fs = require('fs')
var utf8 = require('utf8');

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
   jalangiExecString = jalangiExecString + ' --analysis analysis/CheckModuleLoading.js';
   jalangiExecString = jalangiExecString +' '+ fileName;

   //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
   shelljs.exec(jalangiExecString);
};

function runWithNode (fileName, args){
    var params = '';
    for(nextparam in args){
        params = params+args[nextparam]+ ' ';
    }
    var nodeExecString = '';
    nodeExecString = nodeExecString + $nodePath + ' ' +fileName;
    nodeExecString = nodeExecString + ' ' +params;
    var exitcode = shelljs.exec(nodeExecString).code;
    return exitcode;
}

exports.runWithNode = runWithNode;

exports.runJalangi = function (analysis, inputFile){

    var testroot = './tests/';
    var jalangiExecString = '';
    jalangiExecString = jalangiExecString + $nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js';
    jalangiExecString = jalangiExecString + ' --inlineIID --inlineSource';
    jalangiExecString = jalangiExecString + ' --analysis analysis/'+analysis;
    //jalangiExecString = jalangiExecString + ' -input INPUT';
    jalangiExecString = jalangiExecString +' '+testroot+inputFile;

    //shelljs.exec($nodePath + ' ' + $JALANGI_HOME + '/src/js/commands/jalangi.js ./tests/test-loading-semantics.js');
    var exitCode = shelljs.exec(jalangiExecString).code;
    if(exitCode !== 0)
        return -1;
    var writtenJson = verifyGeneratedJson();
    console.log("StubList generated length "+writtenJson.length);
    return writtenJson.length;

};

function verifyGeneratedJson(){
    var writtenJson = fs.readFileSync('stubList.json');
    return JSON.parse(writtenJson);


}


function runTrasformer(transofrmer, sl, inp, outp ){

    runWithNode(transofrmer, ['-sl '+sl, '-in '+inp, '-o '+outp]);


}

function runTextDiff(js1, js2){

    var diffExecString = '/usr/bin/diff ';
    diffExecString = diffExecString + js1 + ' ';
    diffExecString = diffExecString +  js2

    var exitCode = shelljs.exec(diffExecString).code;
    return exitCode;

}


/*
exports.runS2STransfromer = function (){



}
*/
exports.runTextDiff = runTextDiff;
exports.runTest = runTest;
exports.runTransformer = runTrasformer;
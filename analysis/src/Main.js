


var utility = require('./Utility.js');
var fs = require('fs');
var shelljs = require('shelljs');
var argparse = require('argparse');
var commons = require('../../commons.js');

var path = require('path');
var copydir = require('copy-dir');
const testsRoot = './tests/input/unit/'
const EXPECTED_OUTPUT_PATH_PREFIX = "output-expected";
const INPUT_PATH_PREFIX = "input";



var parser = new argparse.ArgumentParser({
    version : 0.1,
    addHelp : true,
    description : "The source to source transformer for the feature reduction of JS"

});

(function runMain() {


    parser.addArgument(['--analysis'], {help: 'Jalangi Analysis path'});
    parser.addArgument(['--inputFile'], {help: 'input file/script to Jalangi'});
    parser.addArgument(['--inputDir'], {help: 'input dir to Jalangi, name of the dir and the index file inside must be equal'});
    parser.addArgument(['--transformer'], {help: 'Transformer path'});
    parser.addArgument(['--node'], {help: 'is input a node js application'});

    var args = parser.parseArgs();
    if (!args.analysis || !(args.inputFile || args.inputDir)) {
        console.log("ERROR: Insufficient inputs, try -h option");
    }

    var analysis = args.analysis;
    var inputFile = args.inputFile;

    var resultJalangi = null;
    if (!args.node || args.node === 'false') { // unit
           var outputRoot = testsRoot.replace('input','output-actual');
           var outputRootDir = path.dirname(outputRoot);
           var outputPathDir = path.resolve(outputRootDir,'unit');
            //var outputExpectedRoot = testsRoot.replace('input','output-expected');
            var outputExpectedPathDir = path.resolve(outputRootDir,'../'+EXPECTED_OUTPUT_PATH_PREFIX, path.basename(outputPathDir));

            resultJalangi = commons.runJalangi(analysis, inputFile, testsRoot);

    }else{
        //TODO handle Nodejs case
        //resultJalangi = commons.runJalangi(analysis, inputFileName, testsRoot);
    }



    // if dynamic analysis phase exited successfully, compose it with the transformation.
    if(resultJalangi == null || resultJalangi === -1){
        return -1;

    }else{ // Jalangi ran successfully
        var transformer = args.transformer;
        var srcroot = './analysis/src/';

        if(!args.node || args.node === 'false') {
            if (args.inputFile) {
                console.log("CASE :: Transforming input unit test File")
                var fullInputFile = testsRoot + inputFile;
                console.log("fif "+fullInputFile);
                var inputFilePrefix = fullInputFile.substring(0, fullInputFile.lastIndexOf('.'));
                var stubFilePrefix = inputFilePrefix.replace('input', 'output-actual');


                //const stubListOutJSON = stubFilePrefix + "_stubList.json";
                const outJSON = path.resolve(stubFilePrefix+"_out.json");

                var transformerResult = commons.runTransformer(srcroot + transformer, outJSON, testsRoot, stubFilePrefix.substring(0, stubFilePrefix.lastIndexOf('/') + 1));
                console.log("Transformer Out " + transformerResult);
            }else if(args.inputDir){
                console.log("CASE :: Transforming input unit test Application");
                var stubFilePrefix = (testsRoot+args.inputDir+'/'+args.inputDir).replace('input', 'output-actual');
                console.log("stubFilePrefix "+stubFilePrefix);

                const stubListOutJSONAPP = stubFilePrefix+"_stubList.json";
                console.log("stubFile "+stubListOutJSONAPP);
                var transformerResult = commons.runTransformer(srcroot + transformer, stubListOutJSONAPP, testsRoot, stubFilePrefix.substring(0, stubFilePrefix.lastIndexOf('/') + 1));


            }
        }else {


        }

    }

})();

module.exports = {
    testsRoot : testsRoot,
    EXPECTED_OUTPUT_PATH_PREFIX : EXPECTED_OUTPUT_PATH_PREFIX,
    INPUT_PATH_PREFIX : INPUT_PATH_PREFIX
}
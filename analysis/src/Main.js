var utility = require('./Utility.js');
var argparse = require('argparse');
var commons = require('../../commons.js');

var path = require('path');
var copydir = require('copy-dir');

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
    var testsRoot = null;

    // get the input file or directory

    var resultJalangi = null;
    if (!args.node || args.node === 'false') { // unit
        testsRoot = './tests/input/unit/';

        var outputRoot = testsRoot.replace('input','output-actual');

        // TODO Create a function for writing an expected output file with the boilerplate code needed.
        var outputRootExpected = testsRoot.replace('input','output-expected');

        if(args.inputFile) {
            var inputFile = args.inputFile;
            console.log("CASE :: UNIT INPUT FILE");
            //console.log("test root " + testsRoot);
            utility.createExpectedOutputFile(outputRootExpected+inputFile.substring(0,inputFile.lastIndexOf('.')));

            resultJalangi = commons.runJalangi(analysis, inputFile, testsRoot);
        }else if(args.inputDir){
            var appInputDir = args.inputDir;
            var appOutputDir = appInputDir.replace('input','output-actual');
            console.log("CASE :: UNIT INPUT DIR");
            var inputFileName = appInputDir+'/'+appInputDir+'.js';

            // copy the input directory structure in the actual output
            copydir.sync(testsRoot+appInputDir, outputRoot+appInputDir, function(stat, filepath, filename){
                if(stat === 'file' && path.extname(filepath) === '.js') {
                    return false;
                }

                return true;
            }, function(err){
                console.log('ok');
            });

            resultJalangi = commons.runJalangi(analysis, inputFileName, testsRoot);
        }
    }else{
        testsRoot = './tests/input/nodejs/';
        //console.log("test root " + testsRoot);

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


                const stubListOutJSON = stubFilePrefix + "_stubList.json";
                var transformerResult = commons.runTransformer(srcroot + transformer, stubListOutJSON, testsRoot, stubFilePrefix.substring(0, stubFilePrefix.lastIndexOf('/') + 1));
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


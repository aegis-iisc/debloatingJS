var utility = require('./Utility.js');
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
    parser.addArgument(['--nodeapp'], {help: 'node application'});

    var args = parser.parseArgs();
    if (!args.analysis || !(args.inputFile || args.inputDir)) {
        console.log("ERROR: Insufficient inputs, try -h option");
    }

    var analysis = args.analysis;
    var inputFile = args.inputFile;

    /********** Copy the original Application to the Target *******************/

    var mochaInputForApplication = path.resolve(inputFile);
    var applicationDir = path.resolve(path.dirname(mochaInputForApplication), '../');
    //get the stubFile generated for the application
    var outputDirForInput = applicationDir.replace('input', 'output-actual');
    // copy the directory structure of the input application to the actual output-directory
    createDirectoryStructure(applicationDir, outputDirForInput);



    var resultJalangi = null;
    if (!args.node || args.node === 'false') { // unit
           var outputRoot = testsRoot.replace('input','output-actual');
           var outputRootDir = path.dirname(outputRoot);
           var outputPathDir = path.resolve(outputRootDir,'unit');
            //var outputExpectedRoot = testsRoot.replace('input','output-expected');
            var outputExpectedPathDir = path.resolve(outputRootDir,'../'+EXPECTED_OUTPUT_PATH_PREFIX, path.basename(outputPathDir));

            resultJalangi = commons.runJalangi(analysis, inputFile, testsRoot);

    }else{
        console.log("Main :: Nodejs case");

        //resultJalangi = commons.runJalangi(analysis, inputFileName, testsRoot);
        // for each application , we just need to run the app/debloatingJS/__run_tests.js
        var __runTestFile = args.inputFile; // mocha test file for the application
        var __inputApp = args.nodeapp;
        console.log(__inputApp);
        resultJalangi = commons.runJalangi(analysis, __runTestFile, __inputApp, true);
        if(resultJalangi === 0)
            console.log("Main::Jalangi Analysis Phase Executed Successfully");
        else
            console.error("Main::Jalangi Analysis Phase Failed");
    }

    // if dynamic analysis phase exited successfully, compose it with the transformation.
    if(resultJalangi == null || resultJalangi === -1){
        return -1;

    }else{ // Jalangi ran successfully

        console.log("Running Transformer");
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
        }else { // node application case
            console.log("CASE :: Transforming input nodejs Application");
            var jsonOutputPath = path.resolve(outputDirForInput, 'debloatingJS', path.basename(mochaInputForApplication).toString().replace('.js', '_out.json'));

            console.log("Path to the json file "+jsonOutputPath);
            var transformerResult = commons.runTransformer(srcroot + transformer, jsonOutputPath, applicationDir, outputDirForInput, true);
            console.log("Transformer Out " + transformerResult);

            // handle the node case


        }

    }

})();

function createDirectoryStructure(inDir, outDir){

    // copy the application to the output dir
    copydir.sync(inDir, outDir, function(stat, filepath, filename){
        if (stat === 'directory' && filename.toString() === '.git') {
            return false;
        }
        if(stat === 'file' && path.extname(filepath) === '.json') {
            return false;
        }
        if (stat === 'file' && filename.toString().indexOf('_jalangi_.js') !== -1) {
            return false;
        }if(stat === 'directory' && filename === '.git'){
            return false;
        }
        return true;
    }, function(err){
        console.log('ok');
    });
    console.log("Main:Sucessfully copied the application to the target");


}

module.exports = {
    testsRoot : testsRoot,
    EXPECTED_OUTPUT_PATH_PREFIX : EXPECTED_OUTPUT_PATH_PREFIX,
    INPUT_PATH_PREFIX : INPUT_PATH_PREFIX
}
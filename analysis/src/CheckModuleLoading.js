// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*
* @author Ashish Mishra
*/
var fs = require('fs');
var argparse = require('argparse');
var util = require('./Utility');
var argument =  process.argv.slice(2);
var mkdirp = require('mkdirp');
var path = require('path');

var parser = new argparse.ArgumentParser({
    version : 0.1,
    addHelp : true,
    description : "The source to source transformer for the feature reduction of JS"
});

const NODE_TEST_ROOT = path.resolve("./tests/input/nodejs");

// TODO : read the set of tests of a node js application and run the dynamic analysis for each test to collect the output

(function (sandbox) {

    console.log(argument);
    // extracting outputpaths
    var inputFileName = argument[argument.length-1];
    var inputFilePrefix = path.basename(inputFileName); //inputFileName.substring(0, inputFileName.lastIndexOf('.'));
    var outputFilePrefix = inputFilePrefix.replace('input', 'output-actual');

    var jsonOutputPath = null;
    if (isNodeApp(inputFileName)) { // Nodejs case
       var inputDir = path.dirname(inputFileName);
       var outputFilePrefix = inputDir.replace('input', 'output-actual');
       jsonOutputPath = path.resolve(outputFilePrefix, path.basename(inputFileName).toString().replace('.js', '_out.json'));

    } else {
   var outputFilePrefix = inputFilePrefix.replace('input', 'output-actual');
        jsonOutputPath = path.resolve('./tests/output-actual/unit', outputFilePrefix + "_out.json");
    }
    // var stubListOut = outputFilePrefix+"_stubList.txt";
    //const stubListOutJSON = path.resolve('./tests/output-actual/unit', outputFilePrefix + "_stubList.json");

    function MyAnalysis(){

        console.log("Runnning MyAnalysis");
        // collective ojects for loaded and invoked functions
        // collectiveFunctionLoaded = {giid : {laodingLocation : ...  loadedFunName : ...}
        // collectiveFunctionCalled = {giid : {CallingLocation :  val  , calledDefinitionLocation : val,  loadedFunName : val}}
        var collectivefunctionsLoaded = [];//{};
        var collectivefunctionsCalled = [];//{};

        var functionsLoaded = {};
        var loadedFunctionNames = {};
        var functionsCalled = {};
        var calledFunctionNames = {};
        var functionDefLocation  = {};
        var calledFunctionsbase = {};


        // Loaded functions are either declared
        this.declare = function(iid, name, val, isArgument, argumentIndex, isCatchParam){
            if (typeof val === 'function'){

                var id = J$.getGlobalIID(iid);
                // write the function and the file name to the log
                functionsLoaded[id] = J$.iidToLocation(id, iid);
                loadedFunctionNames[id] = name;
            }
        };
        // or defined as a literal
        this.literal = function(iid, val, hasGetterSetter){
            if( typeof val === 'function'){
                var giid = J$.getGlobalIID(iid);
                // write the function and the file name to the log
                functionsLoaded[giid] = J$.iidToLocation(giid,iid);
                loadedFunctionNames[giid] = val.toString().slice(0, val.toString().indexOf('{')).trim();
                var relativePath = util.getReletivePath(J$.iidToLocation(giid, iid));
                collectivefunctionsLoaded.push({
                    loadingLocation: relativePath,
                    loadedFunName: val.toString().slice(0, val.toString().indexOf('{')).trim(),
                    isLiteral: true
                });
            }
        };

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
            var func_def_loc = null;
            if(functionSid) {
                func_def_loc = J$.iidToLocation(functionSid, functionIid);
                //console.log("function definition location "+ func_loc);
            }else{
                func_def_loc = f.name;
                //console.log("NO sid "+ f.name);
            }
            var giid = J$.getGlobalIID(iid);
            functionsCalled[giid] = J$.iidToLocation(giid, iid);
            functionDefLocation[giid] = func_def_loc;
            calledFunctionNames[giid] = f.name ? f.name : f.toString().slice(0, f.toString().indexOf('{')).trim();
            var callingFunctionRelative = util.getReletivePath(J$.iidToLocation(giid, iid));
            var calledDefRelative = util.getReletivePath(func_def_loc);
            collectivefunctionsCalled.push({
                callingLocation: callingFunctionRelative,
                calledDefLocation: calledDefRelative,
                calledFunName: f.name ? f.name : f.toString().slice(0, f.toString().indexOf('{')).trim()
            });

            if(base){
                calledFunctionsbase[giid] = base.toString();
            }
        };

        /*
          Function entered due to execution using apply or call statements
          e.g. P = {f : function {}}; P.f.apply();
         */
        this.functionEnter = function(iid, f, dis, args){
            var giid = J$.getGlobalIID(iid);
            var func_def_loc = util.getReletivePath(J$.iidToLocation(giid, iid));
            if(!f.hasOwnProperty('id')){
                collectivefunctionsCalled.push({
                    callingLocation: null,
                    calledDefLocation:
                    func_def_loc,
                    calledFunName: f.name ? f.name : null
                });
            }
        };

        this.endExecution = function(){
            var resultantStubList = generatePotentialStubs(collectivefunctionsLoaded, collectivefunctionsCalled);
            writeCollectiveJSON(collectivefunctionsLoaded, resultantStubList);

/*
            // TODO refactor this later
            fs.writeFileSync(stubListOutJSON, JSON.stringify(resultantStubList));
*/
        };
    }
    /*
    Takes two objects with Loaded and Called functions information and returns an object containing
    information of functions potential candidates for stubs.
     */
    function generatePotentialStubs(collectiveLoaded, collectiveCalled){
        var resultantString = '';
        // sets maintained as objects
        var loadedSet = {};
        var invokedSet = {};

        for (var id in collectiveLoaded){
            if (collectiveLoaded.hasOwnProperty(id)){
                loadedSet[collectiveLoaded[id].loadingLocation] = 1;
            }
        }

        for (var id in collectiveCalled){
            if (collectiveCalled.hasOwnProperty(id)){
                invokedSet[collectiveCalled[id].calledDefLocation] = 1;
            }
        }

        var resultantSet = setDifference(loadedSet, invokedSet);

        var potentialStubList = [];
        for (var id in resultantSet){
            if (resultantSet.hasOwnProperty(id)){
                if (isNaN(resultantSet[id])){
                    resultantString = resultantString + id + '\n';
                    potentialStubList.push({stubLocation : id});
                }
            }
        }
        return potentialStubList;
    }
    /*
    a set difference function , needed as we are not using native Set feature of JS introduced in ECMA S-6
     */
    function setDifference(setA, setB){
        var diff = setA;
        for(var idA in setA){
            if (setA.hasOwnProperty(idA)){
                if (setA[idA] === 1 ){

                    diff[idA] = (1 - setB[idA]);
                }
            }
        }
        return diff;
    }

    function writeCollectiveJSON (loadedFunctions, unexecutedFunctions) {

        var traceItems = {
            'loadedFunctions': loadedFunctions,
            'unexecutedFunctions': unexecutedFunctions
        };
        mkdirp.sync(path.dirname(jsonOutputPath));
        console.log("Writing generated JSON to " + path.resolve(jsonOutputPath).toString());
        try {
            fs.writeFileSync(path.resolve(jsonOutputPath), JSON.stringify(traceItems, null, 2));
        }catch(e) {

            console.error(e);
        }
    }
    function isNodeApp(inputpath){

        var fileDirectory = path.dirname(inputpath);
        var relative =  path.relative(inputpath, NODE_TEST_ROOT);
        if(relative.toString().charAt(0) === '.' && relative.toString().charAt(relative.length-1) === '.')
           return true;
        return false;
    }
    sandbox.analysis = new MyAnalysis();

}(J$))

/* to run
 node $JALANGI_HOME/src/js/commands/jalangi.js --inlineIID --inlineSource --analysis CheckModuleLoading.js ../tests/test-loading-semantics.js
 */
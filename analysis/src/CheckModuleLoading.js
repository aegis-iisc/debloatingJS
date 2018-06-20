// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*
* @author Ashish Mishra
*/
var fs = require('fs');
var utf8 = require('utf8');
var argparse = require('argparse');
var argument =  process.argv.slice(2);

var parser = new argparse.ArgumentParser({
    version : 0.1,
    addHelp : true,
    description : "The source to source transformer for the feature reduction of JS"

});

// TODO : read the set of tests of a node js application and run the dynamic analysis for each test to collect the output

(function (sandbox){

   /* var input = args.input;
    console.log("--input "+input);
*/
    console.log(argument);
    // extracting outputpaths
    var inputFileName = argument[argument.length-1];
    var inputFilePrefix = inputFileName.substring(0, inputFileName.lastIndexOf('.'));
    var outputFilePrefix = inputFilePrefix.replace('input', 'output-actual');
    //console.log("Prefix" +outputFilePrefix);

    // laoded functions list outfut file path
    var loadedFunctionsOut = outputFilePrefix+ "_loadedfunctions.txt";
    const loadedFunctionsOutJSON = outputFilePrefix+ "_loadedfunctions.json";
    //invoked functions list output file path
    var invokedFunctionsOut = outputFilePrefix +"_invokedfunctions.txt";
    const invokedFunctionsOutJSON = outputFilePrefix+ "_invokedfunctions.json";

    var stubListOut = outputFilePrefix+"_stubList.txt";
    const stubListOutJSON = outputFilePrefix+"_stubList.json";

    function MyAnalysis(){

        // collective ojects for loaded and invoked functions
        // collectiveFunctionLoaded = {giid : {laodingLocation : ...  loadedFunName : ...}
        // collectiveFunctionCalled = {giid : {CallingLocation :  val  , calledDefinitionLocation : val,  loadedFunName : val}}
        var collectivefunctionsLoaded = {};
        var collectivefunctionsCalled = {};


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
                //collectivefunctionsLoaded[id] = {loadingLocation : J$.iidToLocation(id, iid), loadedFunName : name, isLiteral: false};
            }

        };
        // or defined as a literal
        this.literal = function(iid, val, hasGetterSetter){


            if( typeof val === 'function'){
                //    console.log("function Name " +val.name);
                //if (hasGetterSetter)
                    //console.log(" GT-ST "+val.toString());
                var giid = J$.getGlobalIID(iid);
                // write the function and the file name to the log
                functionsLoaded[giid] = J$.iidToLocation(giid,iid);
                loadedFunctionNames[giid] = val.toString().slice(0, val.toString().indexOf('{')).trim();
                collectivefunctionsLoaded[giid] = {loadingLocation : J$.iidToLocation(giid, iid), loadedFunName : val.toString().slice(0, val.toString().indexOf('{')).trim() ,isLiteral : true};

            }




        };
        /*

            this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
                J$.log("function getting invoked "+ f.toString());
            };
        */

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {

            var func_def_loc = null;
            if(functionSid) {
                // console.log("function SID " + functionSid.toString() + " Name "+f.name);
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
            collectivefunctionsCalled[giid] = {callingLocation : J$.iidToLocation(giid, iid), calledDefLocation : func_def_loc, calledFunName : f.name ? f.name : f.toString().slice(0, f.toString().indexOf('{')).trim()};

            if(base){
                calledFunctionsbase[giid] = base.toString();
            }
        };

        this.endExecution = function(){

            printResult(collectivefunctionsLoaded, 'Loaded');
            printResult(collectivefunctionsCalled, 'Called');

            var resultantStubList = generatePotentialStubs(collectivefunctionsLoaded, collectivefunctionsCalled);
            //fs.writeFileSync(stubListOut, resultantStubList);
            fs.writeFileSync(stubListOutJSON, JSON.stringify(resultantStubList));

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
        //return resultantString;
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
    // write the loaded or called function to a json object
    function printResult(collectivebject, str){
        //console.log(str);
        //printobjects(collectivebject);
        //writeCollectiveLog(collectivebject, str);
        writeCollectiveJSON(collectivebject, str);

    }


    function writeCollectiveLog(collectiveObj, str){
        var collective_loaded_string = '';
        var collective_called_string = '';

        for (var id in collectiveObj){
            if(collectiveObj.hasOwnProperty(id)){
                if (str === 'Loaded'){
                    collective_loaded_string = collective_loaded_string + " Function " + collectiveObj[id].loadedFunName +  " defined at " + collectiveObj[id].loadingLocation + '\n';
                }else if (str === 'Called'){
                    collective_called_string = collective_called_string + " Function " + collectiveObj[id].calledFunName + " called at " + collectiveObj[id].callingLocation + " defined at " + collectiveObj[id].calledDefLocation + '\n';
                }


            }
        }
        if(str === 'Loaded')
            fs.writeFileSync(loadedFunctionsOut, collective_loaded_string);
        else
            fs.writeFileSync(invokedFunctionsOut, collective_called_string);


    }
    // the JSON version of the disk-writing
    // loadedFunctions = [{functionName : '', defLocation : ''}]
    // invokedFunctions = [{functionName : '', callLocation : '', defLocation: ''}]
    function writeCollectiveJSON(collectiveObj, str){

        var loadedFunctions = [];
        var invokedFunctions = [];

        for (var id in collectiveObj){
            if(collectiveObj.hasOwnProperty(id)){
                if (str === 'Loaded'){
                    var ldFunction = {functionName : collectiveObj[id].loadedFunName, location: collectiveObj[id].loadingLocation, isLiteral: collectiveObj[id].isLiteral};
                    loadedFunctions.push(ldFunction);

                }else if (str === 'Called'){
                    var invkdFunction = {functionName : collectiveObj[id].calledFunName, callLocation: collectiveObj[id].callingLocation, defLocation: collectiveObj[id].calledDefLocation };
                    invokedFunctions.push(invkdFunction);

                }
            }
        }

        if (str === 'Loaded'){
            console.log("Loaded output "+loadedFunctionsOutJSON);
            fs.writeFileSync(loadedFunctionsOutJSON, JSON.stringify(loadedFunctions));
        }else{
            fs.writeFileSync(invokedFunctionsOutJSON, JSON.stringify(invokedFunctions));

        }

    }
    /* @Sync Function writing log to a file*/

    //utility functions, move it to a new module for such utilities.
    function printobjects(obj){

        for (var id in obj){
            if (obj.hasOwnProperty(id)){
                if(typeof obj[id] === 'object')
                    console.log( id +" : " +printobjects(obj[id]));
                else
                    console.log( id +" : " +obj[id].toString());
            }
        }
    }
    sandbox.analysis = new MyAnalysis();



}(J$))

/* to run
 node $JALANGI_HOME/src/js/commands/jalangi.js --inlineIID --inlineSource --analysis CheckModuleLoading.js ../tests/test-loading-semantics.js
 */
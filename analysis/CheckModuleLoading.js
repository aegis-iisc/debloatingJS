// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*
* @author Ashish Mishra
*/
var fs = require('fs');
var utf8 = require('utf8');
//const https = require("https");

/*
Set.prototype.difference = function (setB){

    var difference = new Set(this);
    for (var elem of setB){
        difference.delete(elem)
    }

    return difference;
}*/
(function (sandbox){

    // laoded functions list outfut file path
    var loadedFunctionsOut = "loadedfunctions.txt";
    //invoked functions list output file path
    var invokedFunctionsOut = "invokedfunctions.txt";
    var stubListOut = "stubList.txt";
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
            collectivefunctionsLoaded[id] = {loadingLocation : J$.iidToLocation(id, iid), loadedFunName : name};
		}

	};
	// or defined as a literal
	this.literal = function(iid, val, hasGetterSetter){


		if( typeof val === 'function'){
		//    console.log("function Name " +val.name);
		    if (hasGetterSetter)
		        console.log(" GT-ST "+val.toString());
            var giid = J$.getGlobalIID(iid);
            // write the function and the file name to the log
            functionsLoaded[giid] = J$.iidToLocation(giid,iid);
            loadedFunctionNames[giid] = val.toString().slice(0, 20);
            collectivefunctionsLoaded[giid] = {loadingLocation : J$.iidToLocation(giid, iid), loadedFunName : val.toString().slice(0,20)};

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
        calledFunctionNames[giid] = f.name ? f.name : f.toString().slice(0, 20);
        collectivefunctionsCalled[giid] = {callingLocation : J$.iidToLocation(giid, iid), calledDefLocation : func_def_loc, calledFunName : f.name ? f.name : f.toString().slice(0, 20)};

        if(base){
            calledFunctionsbase[giid] = base.toString();
        }
    };

    this.endExecution = function(){

        printResult(collectivefunctionsLoaded, 'Loaded');
        printResult(collectivefunctionsCalled, 'Called');

        var resultantStubList = generatePotentialStubs(collectivefunctionsLoaded, collectivefunctionsCalled);
        fs.writeFileSync(stubListOut, resultantStubList);


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

        for (var id in resultantSet){
            if (resultantSet.hasOwnProperty(id)){
                if (isNaN(resultantSet[id]))
                    resultantString = resultantString + id + '\n';
            }
        }

        return resultantString;
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

	function printResult(collectivebject, str){
	    //console.log(str);
	    //printobjects(collectivebject);
	    writeCollectiveLog(collectivebject, str);


    }

    /* Printing the loaded and called functions along with the locations */
	function print(map1, map2, str, map3){

	    writeLogToFile(map1, map2, str, map3);
	    /*for( var id in map1){
	        J$.log("___________________");
            if(map1.hasOwnProperty(id)){
                J$.log("testing log");
                J$.log("Function " + map2[id] + " " + str + " at " + map1[id]);
            }

        }*/
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
    /* @Sync Function writing log to a file*/
    function writeLogToFile(map1, map2, str, map3){


	    var loaded_string = '';
	    var called_string = '';
        for( var id in map1){
            if(map1.hasOwnProperty(id)) {
                if (str.toString() === 'Loaded') {
                    loaded_string = loaded_string + "Function " + map2[id] + " " + str + " at " + map1[id] + '\n';
                }else if (str.toString() === 'Called'){
                    called_string =  called_string + "Function " + map2[id] + " " + str + " at " + map1[id] + " Defined at " + map3[id] + '\n';
                }

            }

        }

        //console.log(loaded_string);
        // sanitize the string for any extra characters
        var ld_string = utf8.encode(loaded_string);
        var ex_string = utf8.encode(called_string);

        var loadedFuncBuffer = new Buffer(ld_string);
        var invokedFuncBuffer = new Buffer(ex_string);
        if(str === 'Loaded')
            fs.writeFileSync(loadedFunctionsOut, ld_string);
        else
            fs.writeFileSync(invokedFunctionsOut, ex_string);


       // The asynchronous file writing does not work from inside a Jalangi callback, files are created but empty
/*
       if (str === 'Loaded')
            fs.open(loadedFunctionsOut, 'w', function(err, fd) {

                if(err){

                    console.log( 'could not open the log file '+ err);
                }
                console.log(" File Descriptor "+fd.toString());
                fs.write(loadedFunctionsOut, loadedFuncBuffer, function(err){
                    if(err){
                        console.log(  ' could not write to the file : '+ err);
                    }

                    fs.close(fd, function(err){
                        if(err){
                            console.log("Error while closing the file "+err);
                        }
                        console.log("successfully written the log");
                    });

                });

            });
        else
            fs.open(invokedFunctionsOut, 'w', function(err, fd) {

                if(err){

                    console.log( 'could not open the log file '+ err);
                }
                console.log(" File Descriptor "+fd.toString());
                fs.write(invokedFunctionsOut, invokedFuncBuffer, function(err){
                    if(err){
                        console.log(  ' could not write to the file : '+ err);
                    }

                    fs.close(fd, function(err){
                        if(err){
                            console.log("Error while closing the file "+err);
                        }
                        console.log("successfully written the log");
                    });

                });

            });
*/
    }

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



}(J$));

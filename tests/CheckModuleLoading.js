// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*
* @author Ashish Mishra
*/
const fs = require("fs");
const https = require("https");
(function (sandbox){


	function MyAnalysis(){

	var functionsLoaded = {};
	var loadedFunctionNames = {};
	var functionsCalled = {};
	var calledFunctionNames = {};
    var calledFunctionsbase = {};
	this.declare = function(iid, name, val, isArgument, argumentIndex, isCatchParam){
		if (typeof val === 'function'){

			var id = J$.getGlobalIID(iid);
		    // write the function and the file name to the log
            functionsLoaded[id] = J$.iidToLocation(id, iid);
            loadedFunctionNames[id] = name;
		}

	};
	this.literal = function(iid, val, hasGetterSetter){

		if( typeof val === 'function'){
            var id = J$.getGlobalIID(iid);
            // write the function and the file name to the log
            functionsLoaded[id] = J$.iidToLocation(id,iid);
            loadedFunctionNames[id] = val.toString()
        }




	};
/*

	this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
	    J$.log("function getting invoked "+ f.toString());
    };
*/

    this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {

        var giid = J$.getGlobalIID(iid);
        functionsCalled[giid] = J$.iidToLocation(giid, iid);
        calledFunctionNames[giid] = f.toString();
        if(base){
            calledFunctionsbase[giid] = base.toString();
        }
    };

    this.endExecution = function(){

        print(functionsLoaded, loadedFunctionNames, "Loaded");
        print(functionsCalled, calledFunctionNames, calledFunctionsbase, "Called");


     };


	}
    /* Printing the loaded and called functions along with the locations */
	function print(map1, map2, str){

	    for( var id in map1){
	        J$.log("___________________");
            if(map1.hasOwnProperty(id)){
                J$.log("testing log");
                J$.log("Function " + map2[id] + " " + str + " at " + map1[id]);
            }

        }
    }
	sandbox.analysis = new MyAnalysis();



}(J$));

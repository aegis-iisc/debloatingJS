// do not remove the following comment
// JALANGI DO NOT INSTRUMENT


/*
 * @author Ashish Mishra
 */

const https = require("https");
const http = require("http");
(function (sandbox){
	// function importing the stub for $fName from a give $url
	const urlForStubs1 = "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";

	const urlForStubs = "http://127.0.0.1:8080";
	var stubImportFunction = function(url, fName){

		console.log("************ IMPORTING STUB FUNCTION *******************");

		http.get(url+"/"+fName, (resp) => {
  			var data = '';
 		  	// A chunk of data has been recieved.
  			resp.on('data', (chunk) => {
				console.log("data received");
				console.log("CHUNK "+chunk);
    				data += chunk;
  			});
 
  		// The whole response has been received. Print out the result.
  			resp.on('end', () => {
				console.log("DATA END");
    				console.log(JSON.parse(data).explanation);
  			});
 		
		// Handle the error from the server
			resp.on('error', (err) => {
  				console.log("Error Raised: " + err.message);
			});
		});

	}
	function MyAnalysis(){
		// major instrumentation go here
		var s = "test function string";

		this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid){
	
		if ( typeof extrafunction === "function" && f === extrafunction){
			console.log("f : "+ f + " base : " + base + " args: "+ args +" isC "+ isConstructor );
			return {f: stubImportFunction, base: base, args : [urlForStubs, "file0.txt"], skip : false };
		
		}

	
	 	};	

	

		
	


	}
	sandbox.analysis = new MyAnalysis();

}(J$));

/*
node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis $this_file /home/ashish/work/NEU/js-codes/livecode/small-testapps/test-app1.js
*/

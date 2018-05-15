

var args = "argument";
foo = function(arg){

	console.log("************* foo function **************");
	extrafunction(arg);
}

bar = function(arg){


	console.log("*********** bar function **************");
}

extrafunction = function(arg){
 	
	console.log("********** skip extra chars *************");


}
	
foo(args);
bar(args);


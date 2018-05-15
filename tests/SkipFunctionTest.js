
goodFunction = function () {
    console.log("Executing good function");
}


evilFunction = function () {
    console.log("****************** Executing bad function *******************");
   
	
}

printReturnValue = function (f){
if (typeof f === "function" && f.apply() !== undefined ){
	console.log("f returns "+  f.apply());
}

}
goodFunction();
//printReturnValue(evilFunction);
t = evilFunction();
console.log(t);
goodFunction();

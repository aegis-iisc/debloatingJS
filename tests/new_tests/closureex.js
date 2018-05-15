/*function makeFunc() {
  name = 'Mozilla';
 	 
 function displayAlternate(){
	console.log(name);

}
	
 function displayName() {
    displayAlternate();
  }
  return displayName;
}

var myFunc = makeFunc();
console.log("my func " +myFunc);
myFunc();

*/

/*
*A test app, The application defines a closure "displayOuterName" which either directly prints the "outerName" to the console or calls another function from the scope if it is already defined.

The code can be reduced in size, if we know either statically or dynamically that alternameFunction is always defined/undefined at line 44, there by allowing to remove if or else branch.
*/

var args = process.argv.slice(2);
var argument = args[0];
function makeFunc(){


	outerName = "outerName";

	if( argument ){

	 function alternameFunction (){
			outerName = "alterName";
	   		console.log(outerName);

		}
	}
	
	function displayOuterName (){
		// if alternameFunction is always defined at this location then the code can b efurther shrtened.
		if (alternameFunction)
			alternameFunction();
		else
			console.log(outerName);

	}
	

	return displayOuterName;

}

var myFunc = makeFunc();
console.log("my func "+myFunc);

myFunc();

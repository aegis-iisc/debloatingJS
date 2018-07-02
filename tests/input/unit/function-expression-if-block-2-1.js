
// function expression declared in an if block and else block
// the function defined in the if branchh is NOT invoked while the outer function foo is invoked at line 22
function foo(){
	var result;
	if(true){
		result = function () {
			return 'true';
		};
	}else{
		result = function (){
			return 'false'

		};
	}
	
	console.log("type of result "+typeof result);
	//console.log(result());

}




// function expression declared in an if block and else block
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
	console.log(result());

}

foo();

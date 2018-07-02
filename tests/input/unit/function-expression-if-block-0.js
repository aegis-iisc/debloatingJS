var condition = true;
var f,g;
if(condition){
	f = function (){

		console.log("Defined f in if");
	};
	g = function (){
		console.log("Defined g in if");

	}
}else{

	f = function (){

		console.log("Defined in else");

	};
	g = function (){
		console.log("Defined g in else");
	}
}


f();

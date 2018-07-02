// a function is called recursively

var loopcounter = 0;
function foo(msg){
	console.log('callstring '+msg);
	while(loopcounter < 2){
		//console.log('x');
		console.log('calling foo again');
		loopcounter++;
		foo(msg+'-'+msg);
			

	}
}
function bar(){
	console.log('called from bar');
	
}
bar();
// no call to foo()

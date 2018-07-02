// a function is called recursively

function foo(msg){
	console.log('callstring '+msg);

		console.log('calling foo again');
		foo(msg+'-'+msg);


}

foo('foo');

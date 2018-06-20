// a generator function declared and invoked 
function* indexGenerator(){  
  var index = 0;
  while(true) {
    yield index++;
  }
}

function* otherGenerator(){
	var constant = 0;
	while(true) {
	 yield constant++;
	}

}
var o = otherGenerator();  
console.log(o.next().value); // => 0  
console.log(o.next().value); // => 1 

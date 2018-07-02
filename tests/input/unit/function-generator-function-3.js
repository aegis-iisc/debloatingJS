// a generator function declared and invoked 
//special case, the indexgenerator is never invoked in original test and is replaced as a function, but current implementaion generates a simple function rather than a generator
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

var obj = {  
  *indexGenerator() {
    var index = 0;
    while(true) {
      yield index++;
    }
  }
}
var g = obj.indexGenerator();  
console.log(g.next().value); // => 0  
console.log(g.next().value); // => 1 


// a generator function defined but never invoked
// Jalangi phase should run and produce loaded, invoked and stubList
// Transformer should generate a generator  function (with a *) and not a normal function.
function* indexGenerator(){  
  var index = 0;
  while(true) {
    yield index++;
  }
}
//var g = indexGenerator();  
//console.log(g.next().value); // => 0  
//console.log(g.next().value); // => 1 

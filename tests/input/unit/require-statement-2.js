// test for require statement, the path for the require parameter must be correctly resolved before executing the modified file, the dependence must also be generated in the output-actual directory

var bar = require('./bar.js');

function foo(){

console.log("Hello from foo");
bar.hello();

}

foo();


// This is a function constructor:
function foo (arg1, arg2) {
    this.firstName = arg1;
    this.lastName  = arg2;
}

function bar (arg1) {
    this.prop = arg1;
}

// This creates a new object
var x = new foo("John", "Doe");
console.log(x.firstName); // Will return "John"
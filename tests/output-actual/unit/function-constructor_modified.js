// This is a function constructor:
function myFunction(arg1, arg2) {
    this.firstName = arg1;
    this.lastName  = arg2;
}

// This creates a new object
var x = new myFunction("John", "Doe");
console.log(x.firstName);                             // Will return "John"
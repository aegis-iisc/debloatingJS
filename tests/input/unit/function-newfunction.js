var x = 'x';
var y = 'y';
var foo = new Function (x, y, 'return x+y');

foo(3, 5);

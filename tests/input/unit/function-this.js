var x = myFunction();

function myFunction () {
    console.log('myFunction');
    return this;
}

function foo () {
    console.log('foo');
}

function bar () {
    console.log('bar');
}
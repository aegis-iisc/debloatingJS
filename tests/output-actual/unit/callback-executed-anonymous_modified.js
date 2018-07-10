function foo (cb) {
    console.log('foo');
    cb();
}
function bar () {
    console.log('bar');
}
foo(bar);
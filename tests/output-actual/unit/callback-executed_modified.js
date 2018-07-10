function foo (cb) {
    console.log('foo');
    cb();
}
foo(function () {
    console.log('anonymous');
});
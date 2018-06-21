function foo (cb) {
    console.log('foo');
}
foo(function () {
    console.log('anonymous');
});
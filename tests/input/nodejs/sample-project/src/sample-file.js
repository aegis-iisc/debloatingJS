function foo () {
    console.log('foo');
    return function () {
        console.log('anonymous');
        return 1;
    };
}

function bar () {
    console.log('bar');
}

module.exports = foo();
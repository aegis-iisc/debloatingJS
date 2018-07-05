var sampleFunction = require('./src/sample-file');

function baz () {
    console.log('baz');
    return 2;
}

function qux () {
    console.log('qux');
}

var x = sampleFunction();

module.exports = {
    baz: baz,
    x: x
};
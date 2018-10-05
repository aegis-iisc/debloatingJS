require('../test/initializers')
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// Instantiate a Mocha instance with options specified in original makefile of the app
var mocha = new Mocha();

var testDir = path.join(__dirname, path.sep, '..', 'test');

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === '.js' && file.indexOf('_jalangi_') < 0;
}).forEach(function (file) {
    mocha.addFile(path.join(testDir, file));
});

mocha.timeout(100000);

mocha.run().on('test', function (test) {
    console.log('Test started: ' + test.title);
}).on('test end', function (test) {
    console.log('Test done');
}).on('pass', function (test) {
    console.log('Test passed');
}).on('fail', function (test, err) {
    console.log('Test failed');
    console.log(err);
}).on('end', function () {
    console.log('All done');
    process.exit();
}).on('exit', function () {
    console.log('Exit');
    process.exit();
});
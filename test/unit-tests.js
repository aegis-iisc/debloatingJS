var assert = require('assert');

const commons = require("../commons.js");

function runTests (testName) {

    it('run jalangi', function () {
        var exitCode = commons.jalangiAnalysis('CheckModuleLoading', testName);
        assert.equal(exitCode, 0);
    });

    // compare actual and expected JSON files generated by the dynamic analysis phase
    it('compare outputs', function () {
        commons.compareOutputs(testName, 'unit');
    });

    it('run both phases', function (){
        var exitCode = commons.runBothPhases(testName, false);
        assert.equal(exitCode, 0);
    });

    it('verify instrumented app execution', function (done) {
        var originalFile = commons.getOriginalPathOrDir(testName, false);
        var modifiedFile = commons.getModifiedPathOrDir(testName, false);
        commons.interceptAppExecution(originalFile, modifiedFile, [], done);
    });
}

describe('unit-tests', function () {

    describe('basic logical operations', function () {
        describe('conditional-execution-1', function () { runTests('conditional-execution-1'); });
        describe('conditional-execution-2', function () { runTests('conditional-execution-2'); });
        describe('conditional-execution-3', function () { runTests('conditional-execution-3'); });
        describe('function-as-method', function () { runTests('function-as-method'); });
        describe('function-constructor', function () { runTests('function-constructor'); });
        describe('function-call-1', function () { runTests('function-call-1'); });// different call expression, no unexercised function. TODO :: Handle this case in jalangi analysis
        describe('function-call-2', function () { runTests('function-call-2'); });
        describe('function-apply', function () { runTests('function-apply'); });
        describe('function-apply-with-args', function () { runTests('function-apply-with-args'); });
        describe('closure-1', function () { runTests('closure-1'); });
        describe('closure-2', function () { runTests('closure-2'); });
        describe('loop-1', function () { runTests('loop-1'); });
        describe('loop-2', function () { runTests('loop-2'); });
        describe('callback-unexecuted', function () { runTests('callback-unexecuted'); });
        describe('callback-unexecuted-anonymous', function () { runTests('callback-unexecuted-anonymous'); });
        describe('callback-executed', function () { runTests('callback-executed'); });
        describe('callback-executed-anonymous', function () { runTests('callback-executed-anonymous'); });
        // Recursive function calls
        describe('recursive-execution-1', function() {
            runTests('recursive-execution-1');
        });
        describe('recursive-execution-2', function() {
            runTests('recursive-execution-2'); // => Transformer fails
        });
    });

    describe('function expressions', function () {
        describe('single-function-not-executed', function () {
            runTests('test1');
        });
        describe('single-function-executed', function () {
            runTests('test3');
        });
        describe('two-functions-one-executed', function () {
            runTests('test4');
        });
        describe('function-expression', function() {
            runTests('function-expression-2');
        });
        describe('function-expression-invoked', function() {
            runTests('function-expression-2-invoked');
        });
        describe('function-expression-if-block', function() {
            runTests('function-expression-if-block');
        });
        describe('function-expression-if-block-2', function() { // The transformer keeps the inner function intact and just replaces the outer function
            runTests('function-expression-if-block-2'); // => failing as the S2STransformer.findFun fails // RESOLVED
        });
        describe('function-expression-if-block-2-1', function() {
            runTests('function-expression-if-block-2-1'); // => failing as the S2STransformer.findFun fails
        });
        describe('function-expression-if-block-0', function() {
            runTests('function-expression-if-block-0');
        });
        describe('function-expression-if-block-3', function() {
            runTests('function-expression-if-block-3'); // => failing as the S2STransformer.findFun fails
        });
        // The function location generated by Jalangi has an offset of 1 from the original source thus our analysis fails to produce a modified file
        describe('function-expression-as-argument', function() {
            runTests('function-expression-as-argument');
        });
        // => The transformed generator function is incorrect
        describe('generator-function-0', function() {
            runTests('function-generator-function-0');
        });
        describe('generator-function-1', function() {
            runTests('function-generator-function');
        });
        describe('generator-function-3', function() {
            runTests('function-generator-function-3');
        });
        describe('generator-function-2', function() {
            runTests('function-newfunction');
        });
        // => following two cases are failing due to incorrect composing of the original and generated files, this case arises when we have a file imported
        describe('require-statement', function() {
            runTests('require-statement');
        });
        describe('require-statement-2', function() {
            runTests('require-statement-2'); // => fails as the modified entry file to the application is not generated.
        });
    });

    // TODO add more unit tests for function declaration.
    describe('ES6-specific and other unsupported features', function () {
        // => Jalangi execution fails
        // =>exit and outcode checks since the original file is copied to the modified upon Jalangi failure
        describe('function-expression-object-property', function() {
            runTests('function-expression-object-property');
        });
        // => jalangi doesnot handle the arrow function
        describe('function-arrow-function', function() {
            runTests('function-arrow-function');
        });
        describe('recursive-execution-3', function() {
            runTests('recursive-execution-3'); // => jalangi parameter list has an upper limit
        });
        describe('function-expression-class', function() {
            runTests('function-expression-class');
        });
        describe('function-expression-class-2', function() {
            runTests('function-expression-class-2');
        });
        // class with an arrow function
        describe('function-arrow-function-class', function() {
            runTests('function-arrow-function-class');
        });
    })

});




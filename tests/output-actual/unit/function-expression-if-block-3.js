var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/function-expression-if-block-3.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
function foo() {
    var result;
    if (true) {
        result = function () {
            return 'true';
        };
    } else {
        result = function () {
            return 'false';
        };
    }
}
foo();
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/function-expression-if-block-0.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
var condition = true;
var f, g;
if (condition) {
    f = function () {
        console.log('Defined f in if');
    };
    g = function () {
        console.log('Defined g in if');
    };
} else {
    f = function () {
        console.log('Defined in else');
    };
    g = function () {
        console.log('Defined g in else');
    };
}
f();
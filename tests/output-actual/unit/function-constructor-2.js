var original_bar = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/function-constructor-2.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
function foo(arg1, arg2) {
    this.firstName = arg1;
    this.lastName = arg2;
}
{
    var original_bar;
    function  bar(arg1) {
                if (original_bar == null) {
            lazyLoader.lazyLoad('bar', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('bar', srcFile);
            eval('original_bar = ' + loadedBody);
            bar = original_bar;
        }
                original_bar.apply(this, arg1);
    }
}
var x = new foo('John', 'Doe');
console.log(x.firstName);
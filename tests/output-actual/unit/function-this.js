var original_bar = null;
var original_foo = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/function-this.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
var x = myFunction();
function myFunction() {
    console.log('myFunction');
    return this;
}
{
    var original_foo;
    function  foo() {
                if (original_foo == null) {
            lazyLoader.lazyLoad('foo', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('foo', srcFile);
            eval('original_foo = ' + loadedBody);
            foo = original_foo;
        }
                original_foo.apply(this);
    }
}
{
    var original_bar;
    function  bar() {
                if (original_bar == null) {
            lazyLoader.lazyLoad('bar', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('bar', srcFile);
            eval('original_bar = ' + loadedBody);
            bar = original_bar;
        }
                original_bar.apply(this);
    }
}
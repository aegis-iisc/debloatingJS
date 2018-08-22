var original_bar = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/callback-unexecuted.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
function foo(cb) {
    console.log('foo');
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
foo(bar);
var original_foo = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/recursive-execution-2.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
var loopcounter = 0;
{
    var original_foo;
    function  foo(msg) {
                if (original_foo == null) {
            lazyLoader.lazyLoad('foo', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('foo', srcFile);
            eval('original_foo = ' + loadedBody);
            foo = original_foo;
        }
                original_foo.apply(this, msg);
    }
}
function bar() {
    console.log('called from bar');
}
bar();
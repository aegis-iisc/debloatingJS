var original_foo = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/loop-1.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
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
while (false) {
    foo();
}
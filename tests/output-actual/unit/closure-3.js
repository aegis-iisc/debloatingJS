var original_plus = null;
var original_sub = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/closure-3.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
function add() {
    var counter = 0;
    {
        var original_plus;
        function  plus() {
                        if (original_plus == null) {
                lazyLoader.lazyLoad('plus', srcFile);
                var loadedBody = lazyLoader.loadAndInvoke('plus', srcFile);
                eval('original_plus = ' + loadedBody);
                plus = original_plus;
            }
                        original_plus.apply(this);
        }
    }
    return counter;
}
{
    var original_sub;
    function  sub(x, y) {
                if (original_sub == null) {
            lazyLoader.lazyLoad('sub', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('sub', srcFile);
            eval('original_sub = ' + loadedBody);
            sub = original_sub;
        }
                original_sub.apply(this, x, y);
    }
}
console.log(add());
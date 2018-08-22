var original_helloUnused = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/bar.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
var exports = module.exports = {};
function hello() {
    console.log('hello from bar');
}
{
    var original_helloUnused;
    function  helloUnused() {
                if (original_helloUnused == null) {
            lazyLoader.lazyLoad('helloUnused', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('helloUnused', srcFile);
            eval('original_helloUnused = ' + loadedBody);
            helloUnused = original_helloUnused;
        }
                original_helloUnused.apply(this);
    }
}
exports.hello = hello;
exports.helloUnused = helloUnused;
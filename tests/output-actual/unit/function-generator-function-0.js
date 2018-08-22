var original_indexGenerator = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/function-generator-function-0.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var lazyLoader = require('/Users/saba/Documents/northeastern/research/debloating/debloatingJS/analysis/src/lazyLoading-helper.js');
var cachedCode = {};
{
    var original_indexGenerator;
    function  indexGenerator() {
                if (original_indexGenerator == null) {
            lazyLoader.lazyLoad('indexGenerator', srcFile);
            var loadedBody = lazyLoader.loadAndInvoke('indexGenerator', srcFile);
            eval('original_indexGenerator = ' + loadedBody);
            indexGenerator = original_indexGenerator;
        }
                original_indexGenerator.apply(this);
    }
}
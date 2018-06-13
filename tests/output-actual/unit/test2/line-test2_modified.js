var original_exports_extraCheks = null;
var original_exports_extraCheks = null;
var original_exports_extraCheks = null;
var original_exports_trim = null;
var original_exports_trim = null;
var original_exports_trim = null;
var srcFile = null / work / NEU / jalangi2 / project / dynamic / tests / input / unit / test2 / line - test2;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var cutility = require('./cutility.js');
var escodegen = require('escodegen');
var cachedCode = {};
var exports = module.exports = {};
var exports = module.exports = {};
exports.line = { line_size: 0 };
exports.drawLine = function (size) {
    if (size > 0) {
        for (i = 0; i < size; i += 1) {
            process.stdout.write('-');
        }
        return size;
    } else {
        return size;
    }
};
exports.trim = function () {
        if (original_exports.trim == null) {
        lazyLoad(exports.trim, srcFile);
        var loadedBody = loadAndInvoke('exports.trim', srcFile);
        eval('original_exports.trim = ' + loadedBody);
        exports.trim = original_exports.trim;
    }
        original_exports.trim.apply(this);
};
exports.extraCheks = function () {
        if (original_exports.extraCheks == null) {
        lazyLoad(exports.extraCheks, srcFile);
        var loadedBody = loadAndInvoke('exports.extraCheks', srcFile);
        eval('original_exports.extraCheks = ' + loadedBody);
        exports.extraCheks = original_exports.extraCheks;
    }
        original_exports.extraCheks.apply(this);
};
function lazyLoad(funName, fileName) {
    var code = fs.readFileSync(fileName, 'utf8');
    var ast = esprima.parse(code.toString(), {
        range: true,
        loc: true,
        tokens: false
    });
    cachedCode[srcFile] = {};
    cutility.extractBodies(fileName);
}
function extractBodies(srcFile) {
    var code = fs.readFileSync(srcFile, 'utf8');
    var ast = esprima.parse(code.toString(), {
        range: true,
        loc: true,
        tokens: false
    });
    cachedCode[srcFile] = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration') {
                var functionName = node.id.name;
                var functionBody = escodegen.generate(node);
                cachedCode[srcFile][functionName] = functionBody;
            } else if (node.type == 'ExpressionStatement') {
                if (node.expression.type == 'AssignmentExpression') {
                    var left = node.expression.left;
                    var right = node.expression.right;
                    if (right.type == 'FunctionExpression') {
                        if (left.type == 'MemberExpression') {
                            var leftVarBaseName = left.object.name;
                            var leftVarExtName = left.property.name;
                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                            var functionName = leftVarPath;
                            var functionBody = escodegen.generate(right);
                            cachedCode[srcFile][functionName] = functionBody;
                        }
                    }
                } else {
                    estraverse.VisitorOption.skip;
                }
            } else {
                estraverse.VisitorOption.skip;
            }
        }
    });
}
function loadAndInvoke(funName, srcFile) {
    for (var elem in cachedCode) {
        if (cachedCode.hasOwnProperty(elem)) {
            if (elem === srcFile) {
                var functions = cachedCode[elem];
                for (var fun in functions) {
                    if (functions.hasOwnProperty(fun)) {
                        if (fun === funName) {
                            console.log(functions[fun]);
                            return functions[fun];
                        }
                    }
                }
            }
        }
    }
}
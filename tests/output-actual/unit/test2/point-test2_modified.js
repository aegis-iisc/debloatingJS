var original_exports_point = null;
var original_exports_point = null;
var original_exports_point = null;
var srcFile = null / work / NEU / jalangi2 / project / dynamic / tests / input / unit / test2 / test2 - innerdir / point - test2;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var cutility = require('./cutility.js');
var escodegen = require('escodegen');
var cachedCode = {};
var exports = module.exports = {};
exports.point = function (x, y) {
        if (original_exports.point == null) {
        lazyLoad(exports.point, srcFile);
        var loadedBody = loadAndInvoke('exports.point', srcFile);
        eval('original_exports.point = ' + loadedBody);
        exports.point = original_exports.point;
    }
        original_exports.point.apply(this, x, y);
};
exports.drawPoint = function (x, y) {
    var origin_x = 0;
    var origin_y = 0;
    for (var i = 0; i < x; i++) {
        console.log('\n');
        for (var j = 0; j < y; j++) {
            console.log('\t');
            j = j + 1;
        }
        i = i + 1;
    }
    console.log('.');
};
exports.drawPoint(3, 4);
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
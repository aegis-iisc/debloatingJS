var original__4_4 = null;
var original__4_4 = null;
var original__4_4 = null;
var original__4_4 = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/callback-unexecuted-anonymous.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var cachedCode = {};
function foo(cb) {
    console.log('foo');
}
foo(function () {
        if (original__4_4 == null) {
        lazyLoad('_4_4', srcFile);
        var loadedBody = loadAndInvoke('_4_4', srcFile);
        eval('original__4_4 = ' + loadedBody);
        _4_4 = original__4_4;
    }
        original__4_4.apply(this);
});
function lazyLoad(funName, fileName) {
    var code = fs.readFileSync(fileName, 'utf8');
    var ast = esprima.parse(code.toString(), {
        range: true,
        loc: true,
        tokens: false
    });
    cachedCode[srcFile] = {};
    extractBodies(fileName);
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
            } else if (node.type == 'FunctionExpression') {
                var funName = null;
                if (node.id !== null) {
                    funName = node.id.name;
                } else {
                    funName = '_' + node.loc.start.line + '_' + node.loc.start.column;
                }
                if (funName !== null) {
                    cachedCode[srcFile][funName] = escodegen.generate(node);
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
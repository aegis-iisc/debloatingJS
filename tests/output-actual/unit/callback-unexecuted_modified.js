var original_bar = null;
var original_bar = null;
var original_bar = null;
var original_bar = null;
var original_bar = null;
var srcFile = '/Users/saba/Documents/northeastern/research/debloating/debloatingJS/tests/input/unit/callback-unexecuted.js';
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var cachedCode = {};
function foo(cb) {
    console.log('foo');
}
{
    var original_bar;
    function  bar() {
                if (original_bar == null) {
            lazyLoad('bar', srcFile);
            var loadedBody = loadAndInvoke('bar', srcFile);
            eval('original_bar = ' + loadedBody);
            bar = original_bar;
        }
                original_bar.apply(this);
    }
}
foo(bar);
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
Var original_exports_diameter = null;
var original_exports_diameter = null;
var original_exports_diameter = null;
var original_exports_diameter = null;
var original_unused_function = null;
var original_unused_function = null;
var original_unused_function = null;
var original_unused_function = null;
var srcFile = null / work / NEU / jalangi2 / project / dynamic / tests / exported_circle_second;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var cutility = require('./cutility.js');
var escodegen = require('escodegen');
var cachedCode = {};
const line = require('./line_modified.js');
var exports = module.exports = {};
const math = Math;
var unused_diameter = 2;
exports.area = function (radius) {
    return math.PI * radius * radius;
};
{
    var original_unused_function;
    function _unused_function() {
                if (original_unused_function == null) {
            lazyLoad('unused_function', srcFile);
            var loadedBody = loadAndInvoke('unused_function', srcFile);
            eval('original_unused_function = ' + loadedBody);
            unused_function = original_unused_function;
        }
                original_unused_function.apply(this);
    }
}
exports.perimeter = function (radius) {
    return 2 * math.PI * radius;
};
exports.drawCircle = function (radius) {
    if (this.isNontrivial(radius)) {
        l = line.drawLine(exports.perimeter(radius));
        line.trim();
    }
};
exports.diameter = function (radius) {
        if (original_exports.diameter == null) {
        lazyLoad(exports.diameter, srcFile);
        var loadedBody = loadAndInvoke('exports.diameter', srcFile);
        eval('original_exports.diameter = ' + loadedBody);
        exports.diameter = original_exports.diameter;
    }
        original_exports.diameter.apply(this, radius);
};
exports.isNontrivial = function (radius) {
    if (radius >= 0)
        return true;
    else
        return false;
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

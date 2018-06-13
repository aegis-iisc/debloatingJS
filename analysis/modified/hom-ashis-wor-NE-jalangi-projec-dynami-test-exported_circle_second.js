var cachedCode = {};
const line = require('./line.js');
var exports = module.exports = {};
const math = Math;
var unused_diameter = 2;
exports.area = function (radius) {
    return math.PI * radius * radius;
};
function unused_function() {
    console.log('Unused Function');
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
    var _var1;
        if (original_exports.diameter == null) {
        lazyLoad(exports.diameter);
        original_exports.diameter = this.eval(cachedCode[exports.diameter]);
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
function lazyLoad(funName) {
    var code = fs.readFileSync(srcFile);
    var ast = esprima.parse(code);
    cachedCode[srcFile] = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration') {
                var functionName = node.id.name;
                var functionBody = node.body;
                cachedCode[srcFile][functionName] = functionBody;
            } else if (node.type == 'ExpressionStatement') {
                if (node.expression.type == 'AssignmentExpression') {
                    var left = node.expression.left;
                    var right = node.expression.right;
                    if (startLineNumber == node.loc.start.line) {
                        if (right.type == 'FunctionExpression') {
                            if (left.type == 'MemberExpression') {
                                console.log('The expression Statement');
                                var leftVarBaseName = left.object.name;
                                var leftVarExtName = left.property.name;
                                var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                var functionName = leftVarPath;
                                var functionBody = right.body;
                                cachedCode[srcFile][functionName] = functionBody;
                            }
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
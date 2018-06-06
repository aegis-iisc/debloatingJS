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
    if (this.line.size > 0) {
        this.lize.size = this.line.size - 1;
    }
};
exports.extraCheks = function () {
    var _var1;
        if (original_exports.extraCheks == null) {
        lazyLoad(exports.extraCheks);
        original_exports.extraCheks = this.eval(cachedCode[exports.extraCheks]);
        exports.extraCheks = original_exports.extraCheks;
    }
        original_exports.extraCheks.apply(this);
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
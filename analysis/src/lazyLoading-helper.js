var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var logger = require('./logger.js');
var commons = require('../../commons.js');

var cachedCode = {};
function lazyLoad(funName, fileName, srcFile) {
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
                            var functionName = commons.getMemberExpressionName(left);
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
                            return functions[fun];
                        }
                    }
                }
            }
        }
    }
}

/*
* A function to log the information of the stubs being executed
* @params functionName being invoked.
* @params timestamp
* @returns 0 / -1
*
*/
function stubInfoLogger(funName, logFile){

    var line = 'Expanded stub '+funName+ ' @ ' + logTimeStamp() + '\n';
    fs.appendFileSync(logFile, line);
}

var logTimeStamp = function(){
    return Date.now();
};


module.exports={

lazyLoad: lazyLoad,
extractBodies: extractBodies,
loadAndInvoke: loadAndInvoke,
stubInfoLogger : stubInfoLogger

};


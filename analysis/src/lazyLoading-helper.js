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

/*
 Locates and loads all the function definition for a given source file @srcFile
 Stores the map functionName -> functionBody for the given @srcFile   in the object cachedCode
 */
function extractBodies(srcFile) {
    var code = fs.readFileSync(srcFile, 'utf8');
    var ast = esprima.parseModule(code.toString(), {
        range: true,
        loc: true,
        tokens: false,
        ecmaVersion : 6,
    });
    cachedCode[srcFile] = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration') {
                var functionName = node.id.name;
                var functionBody = escodegen.generate(node);
                cachedCode[srcFile][functionName] = functionBody;
            } else if (node.type === 'ExpressionStatement') {
                if (node.expression.type === 'AssignmentExpression') {
                    var left = node.expression.left;
                    var right = node.expression.right;
                    if (right.type === 'FunctionExpression') {
                        if (left.type === 'MemberExpression') {
                            var functionName = commons.getMemberExpressionName(left);
                            var functionBody = escodegen.generate(right);
                            cachedCode[srcFile][functionName] = functionBody;
                        }
                    }
                } else {
                    estraverse.VisitorOption.skip;
                }
            } else if (node.type === 'FunctionExpression') {
                var funName = null;
                if (node.id !== null) {
                    funName = node.id.name;
                } else {
                    funName = '_' + node.loc.start.line + '_' + node.loc.start.column;
                }
                if (funName !== null) {
                    cachedCode[srcFile][funName] = escodegen.generate(node);
                }
            }else if (node.type === 'ArrowFunctionExpression'){
                var funName = null;
                if (node.id !== null) {
                    funName = node.id.name;
                } else {
                    funName = '_' + node.loc.start.line + '_' + node.loc.start.column;
                }
                if (funName !== null) {
                    cachedCode[srcFile][funName] = escodegen.generate(node);
                }

            }

            else {
                estraverse.VisitorOption.skip;
            }
        }
    });
}
function loadAndInvokeOlder(funName, srcFile) {
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

function loadAndInvoke(funName, srcFile) {
    for (var elem in cachedCode) {
        if (cachedCode.hasOwnProperty(elem)) {
            if (elem === srcFile) {
                var functions = cachedCode[elem];
                for (var fun in functions) {
                        if (fun === funName) {
                            return functions[fun];

                    }
                }
            }
        }
    }
}

function copyFunctionProperties (thisFunction, loadedFunc){
    // copy the associated properties
    try {
        if (!thisFunction || thisFunction === null) {
            throw new Error('thisFunction is not defined for '+loadedFunc);
            return loadedFunc;
        }
     /*   console.error('**********before*********************');
        console.error(loadedFunc.toString());
     */
     //TODO : Decide about which of the two approaches below is better to copy properties
/*
     for(var prop in thisFunction){
         loadedFunc[prop] = thisFunction[prop];

     }
*/
        Object.keys(thisFunction).forEach(function (key) {
            loadedFunc[key] = thisFunction[key];

        });
       loadedFunc.prototype = thisFunction.prototype;
        /*if(thisFunction.prototype) {

            Object.keys(thisFunction.prototype).forEach(function (key) {

                loadedFunc.prototype[key] = thisFunction.prototype[key];
            });

        }*/
        //loadedFunc[this] = thisFunction.this;
        /* console.error('****************after**************');
        console.error(loadedFunc.toString());
       */ return loadedFunc;

    }catch (error){

        console.error('[copyFunctionProperties] '+error);
        return loadedFunc;

    }
}


/*
* A function to log the information of the stubs being executed
* @params functionName being invoked.
* @params timestamp
* @returns 0 / -1
*
*/
function stubInfoLogger(funName, logFile, fileName){

    var line = 'Expanded stub '+ fileName + ' :: ' +funName+ ' @ ' + logTimeStamp() + '\n';
    fs.appendFileSync(logFile, line);
}

var logTimeStamp = function(){
    return Date.now();
};


module.exports={

lazyLoad: lazyLoad,
extractBodies: extractBodies,
loadAndInvoke: loadAndInvoke,
stubInfoLogger : stubInfoLogger,
copyFunctionProperties : copyFunctionProperties
};


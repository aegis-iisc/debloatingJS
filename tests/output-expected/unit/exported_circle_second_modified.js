// TODO : Add the dependence
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var escodegen = require('Codegenutilities');:

// Add this whole upper block to the set of statements


var cachedCode = {};
// TODO : Use requireupdated.js to update the required fields

const line = require('./line_modified.js');

// TODO : generate this :: DONE
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

/// TODO : Add this declaration
var original_exports_diameter = null;
// TODO : This can be set from the S2STransformer
var srcFile = 'methodSourceFile.txt';
// Just for testing
var cached = {};
cached['methodSourceFile.txt'] = {'exports.diameter': function () { console.log('loaded function'); } };

exports.diameter = function (radius) {
    var _var1;
        if (original_exports_diameter == null) {
	    //TODO : lazyLoad (arg1, arg2), Change the body of  the lazyLoad
            lazyLoad('exports.diameter', srcFile);
            console.log("CACHED");
            console.log(cachedCode);
            var loadedBody = loadAndInvoke('exports.diameter', srcFile);

            eval('original_exports_diameter = '+loadedBody );
            console.log(original_exports_diameter);
            exports.diameter = original_exports_diameter;
        }
            original_exports_diameter.apply(this, []);
};
exports.isNontrivial = function (radius) {
    if (radius >= 0)
        return true;
    else
        return false;
};
// TODO : Add the declaration for the srcFile
var srcFile = '/home/ashish/work/NEU/jalangi2/project/dynamic/scribble/tests/methodSourceFile.txt';
// load based on the functionName rather than line number

// Assumes following
/*
*
*
*/
//function lazyLoad(funName){



//}
// TODO : Add this body for the lazyLoad in the file : DONE
function lazyLoad(funName, fileName) {
    var code = fs.readFileSync(fileName, 'utf8');
    console.log("code "+code);
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
    cachedCode[srcFile] = {};
    extractBodies(fileName);



}


/*function lazyLoad(funName, startLineNumber) {
    var code = fs.readFileSync(srcFile, 'utf8');
    console.log("code "+code);
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
    cachedCode[srcFile] = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration') {
                console.log("Function Node");
                console.log(node);
                var functionName = node.id.name;
                var functionBody = node.body;
                cachedCode[srcFile][functionName] = functionBody;
            } else if (node.type == 'ExpressionStatement') {
                console.log("Function Node");
                console.log(node);

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
}*/

function extractBodies (srcFile) {
    var code = fs.readFileSync(srcFile, 'utf8');
    console.log("code "+code);
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
    cachedCode[srcFile] = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration') {
                console.log("Function Node :: Declaration");
                console.log(node);
                var functionName = node.id.name;
                var functionBody = escodegen.generate(node);
                cachedCode[srcFile][functionName] = functionBody;
            } else if (node.type == 'ExpressionStatement') {
                console.log("Function Node :: Expression");
                console.log(node);

                if (node.expression.type == 'AssignmentExpression') {
                    var left = node.expression.left;
                    var right = node.expression.right;
                    console.log("left  \t ");
                    console.log(left);

                    console.log("right \t");
                    console.log(right);

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

function loadAndInvoke(funName, srcFile){
    for (var elem in cachedCode){
        if(cachedCode.hasOwnProperty(elem)){
            console.log(elem);
            if(elem === srcFile){
                console.log(cachedCode[elem]);
                var functions = cachedCode[elem];
                for (var fun in functions){
                    if (functions.hasOwnProperty(fun)){
                        //var fun_i = eval(functions[fun]);
                        //console.log(fun_i);
                        if(fun === funName) {
                            console.log(functions[fun]);
                            return functions[fun];
                            //eval('var f_i = ' + functions[fun]);
                            //console.log(eval(f_i));
                            //f_i.apply(this, [radius]);
                        }
                    }
                }

            }

        }
    }

}

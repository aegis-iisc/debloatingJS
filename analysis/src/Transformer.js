/*
 A module defining all major transformations for the original nodejs or unit application.
 exports a bunch of APIs which can be used to find and replace a component of a given AST.
 Finally writes the modified files to the output directory provided by the user.

 @author Ashish
 */

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var esquery = require('esquery');
var utility = require('./Utility.js');
var path = require('path');
var fs = require('fs');


var DYNAMIC_PATH = process.env.DYNAMIC_PATH;

//A test transformer JS -> AST -> AST' -> JS'

function findAndReplaceExportStatements(ast){
    var exportsNodes = [];
    estraverse.replace(ast, {
        enter : function (node, parent){
            // find export statements and replace them by the dynamically loaded functions and fields.
            switch (node.type){
                case 'ExpressionStatement':
                    var expression = node.expression;
                    switch (expression.type){
                        case 'AssignmentExpression':
                            var left = expression.left;
                            var right  = expression.right;
                            if(left.type === 'MemberExpression') {
                                var memberExpressionName = getMemberExpressionName(left);
                                if (memberExpressionName.toString().indexOf('module.exports') > -1 || memberExpressionName.toString().indexOf('exports.') > -1) {//} || lhs.toString().indexOf('exports.')){
                                    var modifiedExportsNode =  createStubExportsStatement(node, parent);
                                    exportsNodes.push(modifiedExportsNode);
                                    return modifiedExportsNode;

                                }else
                                    estraverse.VisitorOption.skip;

                            }

                            break;
                        default :
                            estraverse.VisitorOption.skip;
                            break;


                    }

                    break;
                case 'Program':
                    estraverse.VisitorOption.skip;
                    break;

                default:
                    estraverse.VisitorOption.skip;
                    break;
            }
        },
        leave : function (node, parent) {
            estraverse.VisitorOption.skip;
        }

    });

    return exportsNodes;
}



/*
 * a function returning a modified exports statement for a given export node.
 * @param1 : node : exports node to be modified
 * @param2 : parent : parent to the node
 * @param3 : logfile : The logfile required for the stub
 *
 * @return : Traverses the node and returns a modified exports statement for the original based on the type of statement
 */
function createStubExportsStatement(node, parent, logfile) {
    // An exportsStmt should be an ExpressionStmt
    if (!node.type === 'ExpressionStatement')
        return;

    var expr = node.expression;
    var modifiedExpr;
    switch (expr.type) {
        case 'AssignmentExpression':
            var left = expr.left;
            var right = expr.right;
            switch (right.type) {
                case 'ObjectExpression': // case module.exports = {}
                    var propertiesArr = right.properties;
                    var modifiedPropertiesArr = [];
                    propertiesArr.forEach(function (prop) {
                        var modifiedProp = getmodifiedExportsProperty(prop);
                        modifiedPropertiesArr.push(modifiedProp);
                    });
                    var modifiedObjectExpression = {
                        "type": "ObjectExpression",
                        "properties": modifiedPropertiesArr
                    };
                    var modifiedAssignmentExpression = {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": left,
                        "right": modifiedObjectExpression
                    };
                    modifiedExpr = modifiedAssignmentExpression;
                    break;
                case 'FunctionExpression':
                    if(left.property.name  === 'exports') { // case 1 : module.exports = function(){} || module.exports = function foo(), the file is exported as a function
                        var modifiedRightId = {'type':'Identifier', 'name':'_f'};
                        var modifiedAssignmentExpression = {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": left,
                            "right": modifiedRightId
                        };

                    }else{// case 2 : module.exports.foo = function (){} || module.exports.foo = function foo(){}, a function is exported as a property of module.exports
                        var modifiedAssignmentExpression = {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": left,
                            "right": left
                        };
                    }
                    modifiedExpr = modifiedAssignmentExpression

                   /* if (right.id === null) { // case module.exports.foo = function () {} || module.exports = function () {}
                        if(left.property.name  === 'exports') { // case 1 : module.exports = function(){}, the file is exported as a function
                            var modifiedRightId = {'type':'Identifier', 'name':'_f'};
                            var modifiedAssignmentExpression = {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": left,
                                "right": modifiedRightId
                            };
                            modifiedExpr = modifiedAssignmentExpression
                        }else{// case 2 : module.exports.foo = function (){}, a function is exported as a property of module.exports
                            var modifiedAssignmentExpression = {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": left,
                                "right": left
                            };
                            modifiedExpr = modifiedAssignmentExpression


                        }

                    }else { // case module.exports = function foo(){} || module.exports.foo = function foo(){}
                        var fuctionNameNode = right.id;
                        if(left.property.name  === 'exports') { // case 1 : module.exports = function foo(), the file is exported as a function

                         var modifiedRightId = {'type':'Identifier', 'name':'_f'};
                            var modifiedAssignmentExpression = {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": left,
                                "right": modifiedRightId
                            };
                            modifiedExpr = modifiedAssignmentExpression
                        }else{// case 2 : module.exports.foo = function Foo(), a function is exported as a property of module.exports
                            console.log('FunctionExpression Else Case');
                            var modifiedExportedFunction = getmodifiedExportsProperty(fuctionNameNode);
                            var modifiedAssignmentExpression = {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": left,
                                "right": left
                            };
                            modifiedExpr = modifiedAssignmentExpression


                        }
                    }*/


                    break;


                case 'Identifier': // case module.exports.prop1 = prop1
                    console.log('Case Identifier');
                    //modified assignment remains same as the original assignment statement
                    modifiedAssignmentExpression = expr;
                    modifiedExpr = modifiedAssignmentExpression;
                    break;

                default:
                    throw Error('Unhandled Statement Type in Transformer');

                    break;

            }


            break;
        default:
            throw Error('Unhandled Export Statement Stub Creation for ' + expr.type);

            break;


    }
    var modifiedExportStmt = {
        "type": "ExpressionStatement",
        "expression": modifiedExpr
    };

//    utility.printObjWithMsg(escodegen.generate(modifiedExportStmt), 'MODIFIED EXPORT STMT');
    return modifiedExportStmt;


}


function getmodifiedExportsProperty(origPropertyNode){
    switch (origPropertyNode.type){

        case 'Property':
            var value = origPropertyNode.value;
            var meForvalue = getMemberExpressionName(value);
            // update the memberexpression
            var modifiedMEForValue = '_f.' + meForvalue + ';';
            var _modifiedParserForME = esprima.parse(modifiedMEForValue);
            var _modifiedMEForValue = _modifiedParserForME.body[0].expression;

            //utility.printObjWithMsg(origPropertyNode, 'OriginalPropNode');


            var modPropNode = {
                "type": origPropertyNode.type,
                "key": origPropertyNode.key,
                "computed": origPropertyNode.computed,
                "value": _modifiedMEForValue,
                "kind": origPropertyNode.kind,
                "method": origPropertyNode.method,
                "shorthand": origPropertyNode.shorthand
            };

            break;

        case 'Identifier':

            var meForId = getMemberExpressionName(origPropertyNode);
            var modifiedMEForId  = '_f.' + meForId + ';'
            var _modifiedParsedForME = esprima.parse(modifiedMEForId);
            var _modifiedMEForId = _modifiedParsedForME.body[0].expression;

            var modPropNode = _modifiedMEForId;
            utility.printObjWithMsg(modPropNode, 'MODIFIED ME');
            break;
        case 'MemberExpression':
            var meForId = getMemberExpressionName(origPropertyNode);
            var modifiedMEForId  = '_f.' + meForId + ';'
            var _modifiedParsedForME = esprima.parse(modifiedMEForId);
            var _modifiedMEForId = _modifiedParsedForME.body[0].expression;

            var modPropNode = {
                "type":origPropertyNode.type,
                "name":_modifiedMEForId
            };
            utility.printObjWithMsg(modPropNode, 'MODIFIED ME');
            break;

    }
    return modPropNode;

}
/*
 * Create a minimal AST with only export and other nodes
 */
function createMininalAST(originalAST, exportsNodes){
// add all the variable declaration statements
    // add all the exported nodes list

    var fileNameOriginal  = originalAST.attr.fileName;
    var normalizedFileName = path.normalize(path.resolve(fileNameOriginal));
    var modifiedAST = {
        "type": "Program",
        "body": [],
        "sourceType": "script"
    };

    modifiedAST = addHeaderInstructions(modifiedAST);
    modifiedAST = addSrcfileDeclaration(modifiedAST, normalizedFileName);

    var lazyLoadingStmt = 'var f = lazyLoader.loadFile(srcFile);';
    var _lazyLoadingStmt = esprima.parse(lazyLoadingStmt);

    var evalStmt = 'var _f  = eval(f);';
    var _evalStmt = esprima.parse(evalStmt);

    modifiedAST.body.push(_lazyLoadingStmt);
    modifiedAST.body.push(_evalStmt);

    exportsNodes.forEach(function (exportStmt) {

       modifiedAST.body.push(exportStmt);

    });
    return modifiedAST;
}

/*
 * replace function for a given  AST and a function name with an empty function with logging capabilities
 * @param1 : ast to be transformed
 * @param2 : funName to replace
 * @param3 : functionLocId for anonymous functions to be replaced, @param2 will be null in this case
 * @param4 : logfile, where the stubs will log their expansion
 * @param4 : fileName for the current ast
 */

function replaceEmpty(ast, funName, functionLocId, logfile){


    var transformed = false;
    if(funName !== null) { // replace a named function
        var result = estraverse.replace(ast, {
            enter: function (node) {
                if (node.type === 'FunctionDeclaration') {
                    if (node.id.name === funName) {
                        var params = node.params;
                        transformed = true;
                        return createEmptyStubFunctionDeclaration(node.id.name, params, logfile, ast.attr.fileName);
                    } else {
                        estraverse.VisitorOption.skip;
                    }
                }
                if (node.type === 'ExpressionStatement') {
                    if (node.expression.type == 'AssignmentExpression') {
                        var left = node.expression.left;
                        var right = node.expression.right;
                        if (right.type == 'FunctionExpression') {
                            if (left.type == 'MemberExpression') {
                                var leftVarPath = getMemberExpressionName(left);
                                if (leftVarPath === funName) {
                                     transformed = true;
                                     return createEmptyStubFunctionExpression(funName, right.params, left, logfile, ast.attr.fileName);
                                    }
                                } else {
                                    estraverse.VisitorOption.skip;
                                }
                            }
                        }

                }else{
                    estraverse.VisitorOption.skip;
                }
            },
            leave: function (node) {
                estraverse.VisitorOption.skip;

            }
        });
    }else{ // Anonymous 'FunctionExpression case.
        var fNameForId =   createUniqueFunction(functionLocId);
        var result = estraverse.replace(ast, {
            enter: function (node) {

                if (node.type === 'FunctionDeclaration') {
                    if (node.id.name === funName) {
                        var params = node.params;
                            transformed = true;
                            return createEmptyStubFunctionDeclaration(node.id.name, params, logfile, ast.attr.fileName);
                    } else {
                        estraverse.VisitorOption.skip;
                    }

                }
                if (node.type === 'ExpressionStatement') {
                    if (node.expression.type == 'AssignmentExpression') {
                        var left = node.expression.left;
                        var right = node.expression.right;
                        if (right.type == 'FunctionExpression') {
                            if (left.type == 'MemberExpression') {
                                var leftVarPath = getMemberExpressionName(left);
                                result = leftVarPath;
                                if (leftVarPath === funName) {
                                        transformed = true;
                                        return createEmptyStubFunctionExpression(funName, right.params, left, logfile, ast.attr.fileName);
                                } else {
                                    estraverse.VisitorOption.skip;
                                }

                            }
                        }

                    }
                } else if (node.type === 'FunctionExpression') { // replace the function expression if it is anonymous function
                    // compare the unique id for the function
                    if (node.id === null) { // Two cases either ClassMethod or Anonymous Function Expression
                        if(node.loc){ // Skip if node.loc for the generated AST node is undefined.
                            if (utility.compareLoc(node.loc, functionLocId)) {
                                var uniqueFunId = createUniqueFunction(functionLocId);
                                    transformed = true;
                                    return createEmptyStubAnonymousFunctionExpression(uniqueFunId, node.params, null, logfile, ast.attr.fileName);

                            } else
                                estraverse.VisitorOption.skip;
                        }else
                            estraverse.VisitorOption.skip;
                    }else
                        estraverse.VisitorOption.skip;
                }else
                    estraverse.VisitorOption.skip;
            },
            leave: function (node) {
                estraverse.VisitorOption.skip;

            }
        });

    }

    if(transformed) {
        return true;

    }else {
        return false;
    }
}


function createEmptyStubFunctionDeclaration (funName, params, logfile, fileName) {
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var _stubFunDecl = {type: 'FunctionDeclaration', params: params, id: {type: 'Identifier', name: ' '+funName},
        body: { type: 'BlockStatement',
            body: [_callStubInfoLogger]},//_boolRet, _conditionalReturn] },
        generator: false,
        async: false,
        expression: false

    };

    return _stubFunDecl;
}

function createEmptyStubFunctionExpression (funName, params, left, logfile, fileName) { // returns the code used as a replacement of the original code
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger]},//_boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    // create an assignment expressions

    var _expressionStatement = {
        type : 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: left,
            right: _stubFunExpresison,
        }
    };


    return _expressionStatement;

}



function createEmptyStubAnonymousFunctionExpression(funName, params, left, logfile, fileName) {
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger]},// _boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    return _stubFunExpresison;

}




/*
 * replace function for a given  AST and a function name
 * @param1 : ast to be transformed
 * @param2 : funName to replace
 * @param3 : functionLocId for anonymous functions to be replaced, @param2 will be null in this case
 * @param4 : logfile, where the stubs will log their expansion
 * @param4 : fileName for the current ast
 */
function replace(ast, funName, functionLocId, logfile){
    var transformed = false;
    if(funName !== null) { // replace a named function
      addOriginalDeclaration(ast, funName);
      var result = estraverse.replace(ast, {
          enter: function (node) {
              if (node.type == 'FunctionDeclaration') {
                  if (node.id.name === funName) {
                      var params = node.params;
                      if(logfile) {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params, logfile, ast.attr.fileName);
                      }else {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params);
                      }
                  } else {
                      estraverse.VisitorOption.skip;
                  }
              }
              if (node.type == 'ExpressionStatement') {
                  if (node.expression.type == 'AssignmentExpression') {
                      var left = node.expression.left;
                      var right = node.expression.right;
                      /*
                      If right is a FunctionExpression, get the  name of the function from the left
                       */
                      if (right.type == 'FunctionExpression') {
                          if (left.type == 'MemberExpression') {
                              var leftVarPath = getMemberExpressionName(left);

                              if (leftVarPath === funName) {
                                  if(logfile) {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left, logfile, ast.attr.fileName);
                                  }else {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left);
                                  }
                              } else {
                                  estraverse.VisitorOption.skip;
                              }

                          }
                      }

                  }
              }else{
                  estraverse.VisitorOption.skip;
              }
          },
          leave: function (node) {
              estraverse.VisitorOption.skip;

          }
      });
    }else{ // Anonymous 'FunctionExpression case.
      var fNameForId =   createUniqueFunction(functionLocId);
      addOriginalDeclaration(ast, fNameForId);
      var result = estraverse.replace(ast, {
          enter: function (node) {

              if (node.type === 'FunctionDeclaration') {
                  if (node.id.name === funName) {
                      var params = node.params;
                      if(logfile) {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params, logfile, ast.attr.fileName);
                      }else {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params);
                      }
                  } else {
                      estraverse.VisitorOption.skip;
                  }

              }
              if (node.type === 'ExpressionStatement') {
                  if (node.expression.type == 'AssignmentExpression') {
                      var left = node.expression.left;
                      var right = node.expression.right;
                      /*
                      If right is a FunctionExpression, get the  name of the function from the left
                       */
                      if (right.type == 'FunctionExpression') {
                          if (left.type == 'MemberExpression') {
                              var leftVarPath = getMemberExpressionName(left);
                              result = leftVarPath;
                              if (leftVarPath === funName) {
                                  if(logfile) {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left, logfile, ast.attr.fileName);
                                  }else {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left);
                                  }
                              } else {
                                  estraverse.VisitorOption.skip;
                              }

                          }
                      }

                  }
              } else if (node.type === 'FunctionExpression') { // replace the function expression if it is anonymous function
                  // compare the unique id for the function
                  if (node.id === null) { // Two cases either ClassMethod or Anonymous Function Expression
                      /*if(node.attr && node.attr.type === 'ClassMethod'){
                          utility.printObjWithMsg(node.attr, 'MethodAttr');
                          var methodName = node.attr.methodName;
                          var methodKind = node.attr.kind;
                          if(node.loc){ // Skip if node.loc for the generated AST node is undefined.
                              utility.printObjWithMsg(functionLocId, 'CALLING COMPARE LOC 145');
                              if (utility.compareLoc(node.loc, functionLocId)) {
                                  var uniqueFunId = createUniqueFunction(functionLocId);
                                  transformed = true;
                                  if(methodKind === 'constructor') {//TODO : Handle Class Inheritance later
                                      return createStubForClassMethod(uniqueFunId, node.params, methodName, logfile, ast.attr.fileName);
                                      //return createStubForClassConstructor(uniqueFunId, node.params, methodName, logfile, ast.attr.fileName);
                                  }else
                                    return createStubForClassMethod(uniqueFunId, node.params, methodName, logfile, ast.attr.fileName);

                              } else {
                                  estraverse.VisitorOption.skip;
                              }
                          }else{
                              estraverse.VisitorOption.skip;
                          }
                      }else {
                      */  //  utility.printObjWithMsg(node.attr, 'MethodAttr-Else');
                          if(node.loc){ // Skip if node.loc for the generated AST node is undefined.
                              if (utility.compareLoc(node.loc, functionLocId)) {
                                  var uniqueFunId = createUniqueFunction(functionLocId);
                                  if(logfile) {
                                      transformed = true;
                                      return createStubAnonymousFunctionExpression(uniqueFunId, node.params, null, logfile, ast.attr.fileName);
                                  }else {
                                      transformed = true;
                                      return createStubAnonymousFunctionExpression(uniqueFunId, node.params, null);
                                  }
                              } else
                                  estraverse.VisitorOption.skip;
                          }else
                              estraverse.VisitorOption.skip;
                      }
                  }else
                        estraverse.VisitorOption.skip;
          },
          leave: function (node) {
              estraverse.VisitorOption.skip;

          }
      });

  }

  if(transformed) {
        return true;

  }else {
     return false;
  }
}

/* Empty logging version of the class method replacement function */
function replaceEmptyClassMethod(ast, functionName, uniqueId, logfile){
    var transformed = false;
    var methodName = functionName.name;
    var fKind = functionName.kind;
    var fLoc = functionName.loc;
    var superClass = functionName.superClass;
    var uniqueNameForId = createUniqueFunction(uniqueId);

    if(!ast || !functionName)
        throw Error('AST or functionName to be replaced is undefined');
    var result = estraverse.replace(ast, {
        enter: function (node, parent) {
            if(node.id !== null)
                estraverse.VisitorOption.skip;
            switch (node.type){
                case 'FunctionExpression':
                    if(node.attr) {
                        var methodName = node.attr.methodName;
                        var methodKind = node.attr.kind;
                        if ((node.loc.start.line === fLoc.start.line) && (node.loc.start.column === fLoc.start.column)) {
                            transformed = true;
                            if(superClass === null)
                                return createEmptyStubForClassMethod(uniqueNameForId, node.params, methodName, logfile, ast.attr.fileName, null);
                            else
                                return createEmptyStubForClassMethod(uniqueNameForId, node.params, methodName, logfile, ast.attr.fileName, superClass);
                        }

                    }else
                        estraverse.VisitorOption.skip;

                    break;

                default:
                    estraverse.VisitorOption.skip;
                    break;

            }
        },
        leave: function (node) {
            estraverse.VisitorOption.skip;

        }
    });


}

function replaceClassMethod(ast, functionName, uniqueId, logfile){
    var transformed = false;
    var methodName = functionName.name;
    var fKind = functionName.kind;
    var fLoc = functionName.loc;
    var superClass = functionName.superClass;
    var uniqueNameForId = createUniqueFunction(uniqueId);

    if(!ast || !functionName)
        throw Error('AST or functionName to be replaced is undefined');
    addOriginalDeclaration(ast, uniqueNameForId)
    var result = estraverse.replace(ast, {
        enter: function (node, parent) {
            if(node.id !== null)
                estraverse.VisitorOption.skip;
            switch (node.type){
                case 'FunctionExpression':
                    if(node.attr) {
                        var methodName = node.attr.methodName;
                        var methodKind = node.attr.kind;
                        if ((node.loc.start.line === fLoc.start.line) && (node.loc.start.column === fLoc.start.column)) {
                                transformed = true;
                                if(superClass === null)
                                    return createStubForClassMethod(uniqueNameForId, node.params, methodName, logfile, ast.attr.fileName, null);
                                else
                                    return createStubForClassMethod(uniqueNameForId, node.params, methodName, logfile, ast.attr.fileName, superClass);
                            }

                        }else
                            estraverse.VisitorOption.skip;

                    break;

                default:
                    estraverse.VisitorOption.skip;
                    break;

            }
         },
        leave: function (node) {
            estraverse.VisitorOption.skip;

        }
    });
}



function createUniqueFunction(id){
    var name = '_'+id.startline+'_'+id.startcol;
    return name;


}

/* EmptyLogging Version of the ArrowFunction Replacement */
// traverses the @ast and replaces the ArrowFunctionExpressions with @functionName
function replaceEmptyArrowFunctionExpression(ast, functionName, uniqueId, logfile){
    var transformed = false;
    var uniqueNameForId = createUniqueFunction(uniqueId);

    if(!ast || !functionName)
        throw Error('AST or functionName to be replaced is undefined');
    var result = estraverse.replace(ast, {
        enter: function (node) {
            if(node.id !== null)
                estraverse.VisitorOption.skip;
            switch (node.type){
                case 'ArrowFunctionExpression':
                    if(node.attr) {
                        if ((node.loc.start.line === functionName.startline) && (node.loc.start.column === functionName.startcol)) {
                            transformed = true;
                            return createEmptyStubForArrowFunctionExpression(uniqueNameForId, node.params, logfile, ast.attr.fileName)
                        }

                    }else
                        estraverse.VisitorOption.skip;

                    break;

                default:
                    estraverse.VisitorOption.skip;
                    break;

            }
        },
        leave: function (node) {
            estraverse.VisitorOption.skip;

        }
    });


}

function replaceArrowFunctionExpression(ast, functionName, uniqueId, logfile){
    //console.error(functionName, 'Transforming Arrow');
    var transformed = false;
    var uniqueNameForId = createUniqueFunction(uniqueId);

    if(!ast || !functionName)
        throw Error('AST or functionName to be replaced is undefined');
    addOriginalDeclaration(ast, uniqueNameForId);
    var result = estraverse.replace(ast, {
        enter: function (node) {
            if(node.id !== null)
                estraverse.VisitorOption.skip;
            switch (node.type){
                case 'ArrowFunctionExpression':
                    if(node.attr) {
                        if ((node.loc.start.line === functionName.startline) && (node.loc.start.column === functionName.startcol)) {
                            transformed = true;
                            return createStubForArrowFunctionExpression(uniqueNameForId, node.params, logfile, ast.attr.fileName)
                         }

                    }else
                        estraverse.VisitorOption.skip;

                    break;

                default:
                    estraverse.VisitorOption.skip;
                    break;

            }
        },
        leave: function (node) {
            estraverse.VisitorOption.skip;

        }
    });
}

function createEmptyStubForArrowFunctionExpressioncreateStubForArrowFunctionExpression(funName, params, logfile, fileName) {
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var _stubArrowFunctionExpression = {type: 'ArrowFunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger]},// _boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };

    return _stubArrowFunctionExpression;


}

function createStubForArrowFunctionExpression(funName, params, logfile, fileName){

    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"' + funName +'\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);

    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody);';
    var _callEvalStmt = esprima.parse(callEvalStmt);


    var original_Name = 'original_'+ funName.replace(/\./g ,'_');
    var callCopyFunctionProperties = original_Name +' = lazyLoader.copyFunctionProperties( temp, '+original_Name +')';
    var _callCopyFunctionProperties = esprima.parse(callCopyFunctionProperties);

    /* parse the params*/
    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            paramList.push(params[elem].name);
        }
    }
    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

    var _applyStatement = esprima.parse(applyStatement);




    var _notUndefinedRet = {
        "type": "IfStatement",
        "test": {
            "type": "UnaryExpression",
            "operator": "!",
            "argument": {
                "type": "BinaryExpression",
                "operator": "===",
                "left": {
                    "type": "UnaryExpression",
                    "operator": "typeof",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    },
                    "prefix": true
                },
                "right": {
                    "type": "Literal",
                    "value": "undefined",
                    "raw": "'undefined'"
                }
            },
            "prefix": true
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };


    var _stubArrowFunctionExpression = {type: 'ArrowFunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _callLazyLoadStmt, _loadAndInvokeStmt, _callEvalStmt, _applyStatement, _notUndefinedRet ]},// _boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };

    return _stubArrowFunctionExpression;



}


function createEmptyStubForClassMethod(funName, params, methodName, logfile, fileName, superClass){
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    var _stubFunExpresison = {
        type: 'FunctionExpression', id: null, params: params,
        body: {
            type: 'BlockStatement',
            body: [
                _callStubInfoLogger]
        },// _boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };

    return __stubFunExpresison;


}

function createStubForClassMethod(funName, params, methodName, logfile, fileName, superClass){
   // utility.printObjWithMsg(methodName, 'CSTM');
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"' + funName +'\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);

    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var _superInvokeStmt = null;
    if(methodName === 'constructor' && superClass !== null){
        var paramString = '';
        params.forEach(function(pi){

           paramString = paramString+pi.toString()+' ';
        });

        var _superInvokeStmt = {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Super"
                },
                "arguments": params
            }
        };
    }
    var tempFunctionStmt = 'var temp = this.'+methodName;
    var _tempFunctionStmt = esprima.parse(tempFunctionStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody);';
    var _callEvalStmt = esprima.parse(callEvalStmt);


    var original_Name = 'original_'+ funName.replace(/\./g ,'_');
    var callCopyFunctionProperties = original_Name +' = lazyLoader.copyFunctionProperties( temp, '+original_Name +')';
    var _callCopyFunctionProperties = esprima.parse(callCopyFunctionProperties);

    var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, arguments);';

    var _applyStatement = esprima.parse(applyStatement);

    var _notUndefinedRet = {
        "type": "IfStatement",
        "test": {
            "type": "UnaryExpression",
            "operator": "!",
            "argument": {
                "type": "BinaryExpression",
                "operator": "===",
                "left": {
                    "type": "UnaryExpression",
                    "operator": "typeof",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    },
                    "prefix": true
                },
                "right": {
                    "type": "Literal",
                    "value": "undefined",
                    "raw": "'undefined'"
                }
            },
            "prefix": true
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    if(_superInvokeStmt !== null){
        utility.printObjWithMsg(_superInvokeStmt, 'TRUE-SUPERINVOKESTMT');
        var _stubFunExpresison = {
            type: 'FunctionExpression', id: null, params: params,
            body: {
                type: 'BlockStatement',
                body: [
                    _callStubInfoLogger, _callLazyLoadStmt, _loadAndInvokeStmt, _superInvokeStmt, _tempFunctionStmt, _callEvalStmt, _callCopyFunctionProperties, _applyStatement, _notUndefinedRet]
            },// _boolRet, _conditionalReturn]},
            generator: false,
            async: false,
            expression: false

        };
    }else{
        utility.printObjWithMsg(_superInvokeStmt, 'FALSE-SUPERINVOKESTMT');

        var _stubFunExpresison = {
            type: 'FunctionExpression', id: null, params: params,
            body: {
                type: 'BlockStatement',
                body: [
                    _callStubInfoLogger, _callLazyLoadStmt, _loadAndInvokeStmt, _tempFunctionStmt, _callEvalStmt, _callCopyFunctionProperties, _applyStatement, _notUndefinedRet]
            },// _boolRet, _conditionalReturn]},
            generator: false,
            async: false,
            expression: false

        };
    }



    return _stubFunExpresison;


}


function createStubAnonymousFunctionExpressionOlder(funName, params, left, logfile, fileName){
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"' + funName +'\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var tempFunctionStmt = 'var temp = '+funName;
    var _tempFunctionStmt = esprima.parse(tempFunctionStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace('.','_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;

    // a name like exports.clone must be changed to original_exports_clone
    var _underscoredName = funName.replace(/\./g, '_');


    var original_Name = 'original_'+ funName.replace(/\./g ,'_');
    var callCopyFunctionProperties = original_Name +' = lazyLoader.copyFunctionProperties( temp, '+original_Name +')';
    var _callCopyFunctionProperties = esprima.parse(callCopyFunctionProperties);

    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +tempFunctionStmt+ ';' + callEvalStmt + '}';
    var _ifStatement = esprima.parse(ifStatement);

    var invokeStatement = 'return original_'+funName.replace(/\./g ,'_')+ '.apply(this, _param);';
    _ifStatement['consequent'] = esprima.parse('lazyLoader.lazyLoad(' + funName + ')   ;' + callEvalStmt).body[0];

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            paramList.push(params[elem].name);
        }
    }
    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

    var _applyStatement = esprima.parse(applyStatement);


    var booleanRet = 'if (typeof ret === \'boolean\'){ return ret }';

    var _booleanret = esprima.parse(booleanRet);


    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};



/*
    var _stubFunExpresison = {type: 'FunctionExpression', id : {type: 'Identifier', name: ' '+funName}, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _ifStatement,_callCopyFunctionProperties, _applyStatement, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
*/
    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _ifStatement,_callCopyFunctionProperties, _applyStatement, _booleanret, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    return _stubFunExpresison;
}

function createStubAnonymousFunctionExpression(funName, params, left, logfile, fileName){
    //utility.printObjWithMsg(funName, 'CSAFM');
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"' + funName +'\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody);';
    var _callEvalStmt = esprima.parse(callEvalStmt);



    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            paramList.push(params[elem].name);
        }
    }
   /* if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

   */
    var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, arguments);';

    var _applyStatement = esprima.parse(applyStatement);

    var _notUndefinedRet = {
        "type": "IfStatement",
        "test": {
            "type": "UnaryExpression",
            "operator": "!",
            "argument": {
                "type": "BinaryExpression",
                "operator": "===",
                "left": {
                    "type": "UnaryExpression",
                    "operator": "typeof",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    },
                    "prefix": true
                },
                "right": {
                    "type": "Literal",
                    "value": "undefined",
                    "raw": "'undefined'"
                }
            },
            "prefix": true
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    var _boolRet = {
        "type": "IfStatement",
        "test": {
            "type": "BinaryExpression",
            "operator": "===",
            "left": {
                "type": "UnaryExpression",
                "operator": "typeof",
                "argument": {
                    "type": "Identifier",
                    "name": "ret"
                },
                "prefix": true
            },
            "right": {
                "type": "Literal",
                "value": "boolean",
                "raw": "'boolean'"
            }
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };


    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};



    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _callLazyLoadStmt, _loadAndInvokeStmt, _callEvalStmt, _applyStatement, _notUndefinedRet ]},// _boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    return _stubFunExpresison;
}


function createStubFunctionDeclaration (funName, params, logfile, fileName){
    //utility.printObjWithMsg(funName, 'CSFD');
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"'+funName+ '\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var tempFunctionStmt = 'var temp = '+funName;
    var _tempFunctionStmt = esprima.parse(tempFunctionStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace(/\./g ,'_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt);

    var original_Name = 'original_'+ funName.replace(/\./g ,'_');
    var callCopyFunctionProperties = original_Name +' = lazyLoader.copyFunctionProperties( temp, '+original_Name +')';
    var _callCopyFunctionProperties = esprima.parse(callCopyFunctionProperties);

    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +tempFunctionStmt +';' +callEvalStmt + callCopyFunctionProperties + '}';
    var _ifStatement = esprima.parse(ifStatement);

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            paramList.push(params[elem].name);
        }
    }

    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

    var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, arguments);';

    var _applyStatement = esprima.parse(applyStatement);

    var _notUndefinedRet = {
        "type": "IfStatement",
        "test": {
            "type": "UnaryExpression",
            "operator": "!",
            "argument": {
                "type": "BinaryExpression",
                "operator": "===",
                "left": {
                    "type": "UnaryExpression",
                    "operator": "typeof",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    },
                    "prefix": true
                },
                "right": {
                    "type": "Literal",
                    "value": "undefined",
                    "raw": "'undefined'"
                }
            },
            "prefix": true
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    var _boolRet = {
        "type": "IfStatement",
        "test": {
            "type": "BinaryExpression",
            "operator": "===",
            "left": {
                "type": "UnaryExpression",
                "operator": "typeof",
                "argument": {
                    "type": "Identifier",
                    "name": "ret"
                },
                "prefix": true
            },
            "right": {
                "type": "Literal",
                "value": "boolean",
                "raw": "'boolean'"
            }
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};


    var _stubFunDecl = {type: 'FunctionDeclaration', params: params, id: {type: 'Identifier', name: ' '+funName},
        body: { type: 'BlockStatement',
            body: [_callStubInfoLogger, _ifStatement,  _applyStatement, _notUndefinedRet]},//_boolRet, _conditionalReturn] },
        generator: false,
        async: false,
        expression: false

    };

    return _stubFunDecl;


}

// generate stub for fully classified AssignmentExpression

function createStubFunctionExpression (funName, params, left, logfile, fileName) { // returns the code used as a replacement of the original code

    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\',\''+fileName +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    // function expression assignment
    var callLazyLoadStmt = 'lazyLoader.lazyLoad(' + funName +', srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var tempFunctionStmt = 'var temp = '+funName;
    var _tempFunctionStmt = esprima.parse(tempFunctionStmt);


    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace(/\./g ,'_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt);



    var original_Name = 'original_'+ funName.replace(/\./g ,'_');
    var callCopyFunctionProperties = original_Name +' = lazyLoader.copyFunctionProperties( temp, '+original_Name +')';
    var _callCopyFunctionProperties = esprima.parse(callCopyFunctionProperties);

    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' + tempFunctionStmt +';' +callEvalStmt  + callCopyFunctionProperties + '}';


    var _ifStatement = esprima.parse(ifStatement);
    _ifStatement['consequent'] = esprima.parse('lazyLoader.lazyLoad(' + funName + ')   ;' + callEvalStmt).body[0];

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            paramList.push(params[elem].name);
        }
    }

/*
    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';
*/

    var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, arguments);';

    var _applyStatement = esprima.parse(applyStatement);
    var _notUndefinedRet = {
        "type": "IfStatement",
        "test": {
            "type": "UnaryExpression",
            "operator": "!",
            "argument": {
                "type": "BinaryExpression",
                "operator": "===",
                "left": {
                    "type": "UnaryExpression",
                    "operator": "typeof",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    },
                    "prefix": true
                },
                "right": {
                    "type": "Literal",
                    "value": "undefined",
                    "raw": "'undefined'"
                }
            },
            "prefix": true
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    var _boolRet = {
        "type": "IfStatement",
        "test": {
            "type": "BinaryExpression",
            "operator": "===",
            "left": {
                "type": "UnaryExpression",
                "operator": "typeof",
                "argument": {
                    "type": "Identifier",
                    "name": "ret"
                },
                "prefix": true
            },
            "right": {
                "type": "Literal",
                "value": "boolean",
                "raw": "'boolean'"
            }
        },
        "consequent": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "ret"
                    }
                }
            ]
        },
        "alternate": null
    };

    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};


    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _ifStatement, _applyStatement, _notUndefinedRet]},//_boolRet, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    // create an assignment expressions

    var _expressionStatement = {
        type : 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: left,
            right: _stubFunExpresison,
        }
    };


    return _expressionStatement;
}

function lazyLoad(funName, fileName) {
    var code = fs.readFileSync(fileName, 'utf8');
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
    cachedCode[srcFile] = {};
    extractBodies(fileName);

}

function addCachedCodeDeclaration(ast){

    var cachedCodeString = 'var cachedCode = {};';
    var _cachedCodeString = esprima.parse(cachedCodeString.toString() ,{range: true, loc: true, tokens: true} );
    ast.body.unshift(_cachedCodeString);
    return ast;

}


function createLazyLoad (funName) {

    var astForlazyLoad = esprima.parse(lazyLoad.toString(), {range: true, loc: true, tokens: true});
    return astForlazyLoad;


}


function addHeaderInstructions (ast){
        var lazyLoaderPath = path.resolve(DYNAMIC_PATH, 'analysis/src/lazyLoading-helper.js');
        var headerInstructions = 'var lazyLoader = require(\'' + lazyLoaderPath + '\');';
      var _headerInstructions = esprima.parse(headerInstructions.toString(), {range: true, loc : true, tokens: true});
      ast.body.unshift(_headerInstructions);
      return ast;

}

function addOriginalDeclaration(astForInput, functionName) {
    var originalDeclaration = '';

    if (functionName.type === 'UniqueFunctionId') {
        var uniqueFnName = createUniqueFunction(functionName);
        originalDeclaration = originalDeclaration + ' var original_' + uniqueFnName + ' = null;';
        var _originalDeclaration = esprima.parse(originalDeclaration.toString(), {
            range: true,
            loc: true,
            tokens: false
        });
        astForInput.body.unshift(_originalDeclaration);
        return;
    } else {
        // simple function name
        if (functionName.toString().indexOf('.') === -1) {
            originalDeclaration = originalDeclaration + ' var original_' + functionName + ' = null;';

        } else { // member expression
            //repalce a.b.c -> a_b_c
            var _underscoredName = functionName.replace(/\./g, '_');
            originalDeclaration = originalDeclaration + ' var original_' + _underscoredName + ' = null;'
        }

        var _originalDeclaration = esprima.parse(originalDeclaration.toString(), {
            range: true,
            loc: true,
            tokens: false
        });
        astForInput.body.unshift(_originalDeclaration);
        return;
    }
}

function addSrcfileDeclaration (astForInput, filename) {
    var normalized = path.normalize(path.resolve(filename));
    var srcFileDeclaration = '';
    if(normalized.substr(-3) === '.js')
        srcFileDeclaration = srcFileDeclaration + ' var srcFile = \'' + normalized.toString()+'\';';
    else
        srcFileDeclaration = srcFileDeclaration + ' var srcFile = \'' + normalized.toString() + '.js\';';
    var _srcFileDeclaration = esprima.parse(srcFileDeclaration.toString(), {range: true, loc: true, tokens: false});

    // add just after the require statements
    astForInput.body.unshift(_srcFileDeclaration);
    return astForInput;


}

function extractBodies (srcFile) {
    var code = fs.readFileSync(srcFile, 'utf8');
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
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
                            var leftVarPath = getMemberExpressionName(left);

/*
                            var leftVarBaseName = left.object.name;
                            var leftVarExtName = left.property.name;
                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
*/
                            var functionName = leftVarPath;
                            var functionBody = escodegen.generate(right);
                            cachedCode[srcFile][functionName] = functionBody;
                        }
                    }
                }else {
                    estraverse.VisitorOption.skip;
                }
            }else if(node.type == 'FunctionExpression'){ // anonymous function, store unique-id with the body.
                var funName = null;
                if(node.id !== null){
                    funName = node.id.name;
                }else{
                    funName = '_'+node.loc.start.line+'_'+node.loc.start.column;

                }
                if(funName !== null){
                    cachedCode[srcFile][funName] = escodegen.generate(node);
                }
            }
            else {
                estraverse.VisitorOption.skip;
            }
        }
    });
}

function createExtractBodies(){
    var _astextractBodies = esprima.parse(extractBodies.toString(), {range: true, loc: true, tokens : false});
    return _astextractBodies;
}

function loadAndInvoke(funName, srcFile){
    for (var elem in cachedCode){
        if(cachedCode.hasOwnProperty(elem)){
            if(elem === srcFile){
                var functions = cachedCode[elem];
                for (var fun in functions){
                    if (functions.hasOwnProperty(fun)){
                        if(fun === funName) {
                           // console.log(functions[fun]);
                            return functions[fun];

                        }
                    }
                }

            }

        }
    }

}


function createLoadAndInvokeBody(){
    var _loadAndInvokeBody = esprima.parse(loadAndInvoke.toString(), {range: true, loc: true, tokens : false});
    return _loadAndInvokeBody;
    //ast.body.push(_astextractBodies);
}

function updateRequireDeclaration (ast, globalModifiedFilesList){

    estraverse.replace(ast,
        {  enter: function (node, parent) { // check for function name and replace
                if(node.type == 'VariableDeclarator'){
                    var id = node.id;
                    var init = node.init;
                    if(init !== null){
                        if(init.type == 'CallExpression'){
                            var callee = init.callee;
                            var callee_name = callee.name;
                            if(callee_name == 'require'){
                                var requireAsrguments =  init.arguments;
                                if(Array.isArray(requireAsrguments)){
                                    var args = [];
                                    for(l in requireAsrguments){
                                        var currentLiteral = requireAsrguments[l].value;
                                        var prefix = currentLiteral.substring(0, currentLiteral.lastIndexOf('/')+1);
                                        var trimmedLiteral = currentLiteral.substring(currentLiteral.lastIndexOf('/')+1);
                                        if(globalModifiedFilesList.hasOwnProperty(trimmedLiteral)) {
                                            var newLiteralValue = globalModifiedFilesList[trimmedLiteral];
                                            var newLiteral = {type: 'Literal', value: prefix+newLiteralValue};
                                            args.push(newLiteral);
                                        }
                                    }
                                    if(args.length > 0) {
                                        var new_VariableDeclarator = {
                                            type: 'VariableDeclarator',
                                            id: node.id,
                                            init: {
                                                type: 'CallExpression',
                                                callee: {
                                                    type: 'Identifier',
                                                    name: 'require',
                                                    range: node.init.range,
                                                    loc: node.init.loc
                                                },
                                                arguments: args
                                            },
                                            range: node.range,
                                            loc: node.loc
                                        };
                                        return new_VariableDeclarator;
                                    }else{
                                        return node;
                                    }

                                }else{
                                    estraverse.VisitorOption.skip;
                                }

                            }else{
                                //skip
                                estraverse.VisitorOption.skip;
                            }
                        }else{
                            // skip
                            estraverse.VisitorOption.skip;
                        }}else {
                        estraverse.VisitorOption.skip;
                    }
                    // create a new node and return that



                }else{
                    //skip
                    estraverse.VisitorOption.skip;
                }
            },

            leave: function (node, parent) {
                estraverse.VisitorOption.skip;
            }

        });
    return; // return void
}


function getMemberExpressionName(pathStart){
    var prefix ='';
    var node = pathStart;
    while (node.type === "MemberExpression"){
        prefix = '.'+node.property.name +prefix;
        node = node.object;
    }
    if(node.type === "Identifier"){ // terminal case
        prefix = node.name+prefix;
    }
    return prefix;
}
module.exports = {
    updateRequireDeclaration: updateRequireDeclaration,
    createLoadAndInvokeBody : createLoadAndInvokeBody,
    createExtractBodies: createExtractBodies,
    addSrcfileDeclaration: addSrcfileDeclaration,
    addOriginalDeclaration: addOriginalDeclaration,
    addHeaderInstructions: addHeaderInstructions,
    createStubFunctionExpression: createStubFunctionExpression,
    createStubFunctionDeclaration: createStubFunctionDeclaration,
    createStubAnonymousFunctionExpression: createStubAnonymousFunctionExpression,
    replace: replace,
    replaceEmpty : replaceEmpty,
    addCachedCodeDeclaration: addCachedCodeDeclaration,
    createLazyLoad:createLazyLoad,
    replaceClassMethod : replaceClassMethod,
    replaceEmptyClassMethod : replaceEmptyClassMethod,
    replaceArrowFunctionExpression: replaceArrowFunctionExpression,
    replaceEmptyArrowFunctionExpression : replaceEmptyArrowFunctionExpression,
    createStubExportsStatement : createStubExportsStatement,
    findAndReplaceExportStatements :findAndReplaceExportStatements,
    createMininalAST : createMininalAST

};



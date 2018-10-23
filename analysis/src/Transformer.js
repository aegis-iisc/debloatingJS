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

/*
 * replace function for a given  AST and a function name
 */
function replace(ast, funName, functionLocId, logfile){
    var transformed = false;
    if(funName !== null) { // replace a named function
      console.log("Transforming the AST for the function ");
      //+ JSON.stringify(funName));
      addOriginalDeclaration(ast, funName);
      var result = estraverse.replace(ast, {
          enter: function (node) {
              if (node.type == 'FunctionDeclaration') {
                  if (node.id.name === funName) {
                      var params = node.params;
                      if(logfile) {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params, logfile);
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
                                  console.log("Replacing " + node + ' with ' + funName);
                                  if(logfile) {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left, logfile);
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
      }
  else{ // Anonymous 'FunctionExpression case.
      console.log("Transforming the AST for the anonymous function with id " );
          //JSON.stringify(functionLocId));
      var fNameForId =   createUniqueFunction(functionLocId);
      addOriginalDeclaration(ast, fNameForId);
      var result = estraverse.replace(ast, {
          enter: function (node) {

              if (node.type == 'FunctionDeclaration') {
                  if (node.id.name === funName) {
                      var params = node.params;
                      if(logfile) {
                          transformed = true;
                          return createStubFunctionDeclaration(node.id.name, params, logfile);
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
                              result = leftVarPath;
                              if (leftVarPath === funName) {
                                  if(logfile) {
                                      transformed = true;
                                      return createStubFunctionExpression(funName, right.params, left, logfile);
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
              } else if (node.type == 'FunctionExpression') { // replace the function expression if it is anaonymous function
                  // compare the unique id for the function
                  if (node.id == null) {
                      if(node.loc){ // Skip if node.loc for the generated AST node is undefined.
                          if (utility.compareLoc(node.loc, functionLocId)) {
                              var uniqueFunId = createUniqueFunction(functionLocId);
                              if(logfile) {
                                  transformed = true;
                                  return createStubAnonymousFunctionExpression(uniqueFunId, node.params, null, logfile);
                              }else {
                                  transformed = true;
                                  return createStubAnonymousFunctionExpression(uniqueFunId, node.params, null);
                              }
                          } else {
                              estraverse.VisitorOption.skip;
                          }
                      }else{
                          estraverse.VisitorOption.skip;
                      }
                  } else {
                        estraverse.VisitorOption.skip;

                  }

              }
          },
          leave: function (node) {
              estraverse.VisitorOption.skip;

          }
      });

  }

  if(transformed)
      console.error('Replace Ended with Replacement');
  else
    console.log("Replace Ended w/o Replacement");
}

function createUniqueFunction(id){
    var name = '_'+id.startline+'_'+id.startcol;
    return name;


}



function createStubAnonymousFunctionExpression(funName, params, left, logfile){
    console.log("Creating stub for anonymous function expression");
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"' + funName +'\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);
    var callEvalStmt = 'eval(\"original_'+funName.replace((/\./g ,'_'))+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace('.','_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;

    // a name like exports.clone must be changed to original_exports_clone
    var _underscoredName = funName.replace(/\./g, '_');

    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +callEvalStmt + '}';
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

    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};



    var _stubFunExpresison = {type: 'FunctionExpression', id : {type: 'Identifier', name: ' '+funName}, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _ifStatement,_applyStatement, _conditionalReturn]},
        generator: false,
        async: false,
        expression: false

    };
    return _stubFunExpresison;
}

function createStubFunctionDeclaration (funName, params, logfile){
    console.log("Creating stub for FunctioneDeclaration "+funName);
    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);

    var callLazyLoadStmt = 'lazyLoader.lazyLoad(\"'+funName+ '\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace(/\./g ,'_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;


    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +callEvalStmt + '}';
    var _ifStatement = esprima.parse(ifStatement);

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
          //  console.log(params[elem]);
            paramList.push(params[elem].name);
        }
    }

    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

    var _applyStatement = esprima.parse(applyStatement);

    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};


    var _stubFunDecl = {type: 'FunctionDeclaration', params: params, id: {type: 'Identifier', name: ' '+funName},
        body: { type: 'BlockStatement',
            body: [_callStubInfoLogger, _ifStatement, _applyStatement, _conditionalReturn] },
        generator: false,
        async: false,
        expression: false

    };

    return _stubFunDecl;


}

// generate stub for fully classified AssignmentExpression

function createStubFunctionExpression (funName, params, left, logfile) { // returns the code used as a replacement of the original code

    var callStubInfoLogger = 'lazyLoader.stubInfoLogger(\'' +funName + '\',\''+logfile +'\')';
    var _callStubInfoLogger = esprima.parse(callStubInfoLogger);
    // function expression assignment
    var callLazyLoadStmt = 'lazyLoader.lazyLoad(' + funName +', srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
    var loadAndInvokeStmt = 'var loadedBody = lazyLoader.loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);
    var callEvalStmt = 'eval(\"original_'+funName.replace(/\./g ,'_')+' = \" \+loadedBody); '+funName+' = '+'original_'+funName.replace(/\./g ,'_')+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;


    var ifStatement = 'if (original_' + funName.replace(/\./g ,'_') + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +callEvalStmt + '}';



    var _ifStatement = esprima.parse(ifStatement);
    _ifStatement['consequent'] = esprima.parse('lazyLoader.lazyLoad(' + funName + ')   ;' + callEvalStmt).body[0];

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
          //  console.log(params[elem]);
            paramList.push(params[elem].name);
        }
    }

    if(paramList.length > 0)
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this, ['+paramList.toString() +']);';
    else
        var applyStatement = 'var ret = original_'+funName.replace(/\./g ,'_')+'.apply(this);';

    var _applyStatement = esprima.parse(applyStatement);

    var _conditionalReturn = {"type":"IfStatement",
        "test":{"type":"Identifier","name":"ret"},
        "consequent":{"type":"BlockStatement",
            "body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"ret"}}]},
        "alternate":null};


    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                _callStubInfoLogger, _ifStatement,_applyStatement, _conditionalReturn]},
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
   // console.log("code "+code);
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
   // console.log(escodegen.generate(astForlazyLoad));
    return astForlazyLoad;


}


function addHeaderInstructions (ast){
  /* var headerInstructions = 'var fs = require(\'fs\');\n' +
        'var esprima = require(\'esprima\');\n' +
        'var estraverse = require(\'estraverse\');\n' +
       // 'var cutility = require(\'./cutility.js\');\n' +
        'var escodegen = require(\'escodegen\'); \n' +
  // */ // var headerInstructions =  'var lazyLoader = require(\'/home/ashish/work/NEU/jalangi2/project/dynamic/analysis/src/lazyLoading-helper.js\');'; //TODO give an exact path of the helper file
        var lazyLoaderPath = path.resolve(DYNAMIC_PATH, 'analysis/src/lazyLoading-helper.js');
        var headerInstructions = 'var lazyLoader = require(\'' + lazyLoaderPath + '\');';


    //'var lazyLoader = require("' + path.resolve(__dirname, 'lazyLoading-helper.js') + '")';
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

        /*
              estraverse.traverse(astForInput,
                  {
                      enter: function (node, parent) {

                          if (node.type == 'FunctionDeclaration') {
                              var nodeFunctionName = node.id.name;
                              if (nodeFunctionName === functionName) {
                                  // add the originalDeclaration statement

                                  astForInput.body.unshift(_originalDeclaration);
                              }

                          } else if (node.type == 'ExpressionStatement') {

                              if (node.expression.type == 'AssignmentExpression') {
                                  var left = node.expression.left;
                                  var right = node.expression.right;

                                  if (right.type == 'FunctionExpression') {
                                      if (left.type == 'MemberExpression') {
                                          var leftVarPath = getMemberExpressionName(left);

                                          /!*
                                                                       var leftVarBaseName = left.object.name;
                                                                       var leftVarExtName = left.property.name;
                                                                       var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                          *!/
                                          var functionNameFull = leftVarPath;
                                          if (functionNameFull === functionName) {
                                              astForInput.body.unshift(_originalDeclaration);

                                          }

                                      }
                                  }
                              } else {
                                  estraverse.VisitorOption.skip;
                              }
                          } else {
                              estraverse.VisitorOption.skip;
                          }
                      },
                      leave: function (node, parent) {

                          estraverse.VisitorOption.skip;

                      }
                  });

          }
        */
        return;
    }
}

function addSrcfileDeclaration (astForInput, filename) {
    var normalized = path.normalize(path.resolve(filename));
    var srcFileDeclaration = '';
    var srcFileDeclaration = srcFileDeclaration + ' var srcFile = \'' + normalized.toString() + '.js\';';
    var _srcFileDeclaration = esprima.parse(srcFileDeclaration.toString(), {range: true, loc: true, tokens: false});

    // add just after the require statements
    astForInput.body.unshift(_srcFileDeclaration);


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
    addCachedCodeDeclaration: addCachedCodeDeclaration,
    createLazyLoad:createLazyLoad

};



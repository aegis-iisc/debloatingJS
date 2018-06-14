/*
 A module defining all major transformations for the original nodejs or unit application.
 exports a bunch of APIs which can be used to find and replace a component of a given AST.
 Finally writes the modified files to the output directory provided by the user.

 @author Ashish
 */

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
//var utility = require('./Utility.js');
var cutility = require('./cutility.js')

var fs = require('fs');

var exports = module.exports = {};

/*
A test transformer JS -> AST -> AST' -> JS'
 */



// replace function for a given  AST and a function name
exports.replace = function (ast, funName){
    console.log("Transforming the AST for the function " + funName);

    exports.addOriginalDeclaration(ast, funName);

    var result = estraverse.replace(ast, {
        enter: function (node) {

            if (node.type == 'FunctionDeclaration') {

                if (node.id.name === funName) {
                    var params = node.params;
                    return exports.createStubFunctionDeclaration(node.id.name, params);
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
                            var leftVarBaseName = left.object.name;
                            var leftVarExtName = left.property.name;
                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                            result = leftVarPath;
                            if(leftVarPath === funName){
                                console.log("Replacing "+node+ ' with '+funName);
                                return exports.createStubFunctionExpression(funName, right.params, left);
                            }else{
                                estraverse.VisitorOption.skip;
                            }

                        }
                    }

                }
            }
        },
        leave: function (node) {
            estraverse.VisitorOption.skip;

        }
    });

};

exports.createStubFunctionDeclaration = function (funName, params){ // returns the code used as a replacement of the original code
    console.log("Creating stub for declaration");
    //var _originalFunNameDecl = {type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'original_'+funName}, init: null}], kind: 'var'};
    var callLazyLoadStmt = 'lazyLoad(\"'+funName+ '\", srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);
/*
    var callEvalStmt = 'original_'+funName+' = this.eval(cachedCode['+funName+']); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;*/

    var loadAndInvokeStmt = 'var loadedBody = loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var callEvalStmt = 'eval(\"original_'+funName+' = \" \+loadedBody); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;


    var ifStatement = 'if (original_' + funName + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +callEvalStmt + '}';

    var _ifStatement = esprima.parse(ifStatement);

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            console.log(params[elem]);
            paramList.push(params[elem].name);
        }
    }

    if(paramList.length > 0)
        var returnStatement = 'original_'+funName+'.apply(this, '+paramList.toString() +');';
    else
        var returnStatement = 'original_'+funName+'.apply(this);';
    var _returnStatement = esprima.parse(returnStatement);


    var _stubFunDecl = {type: 'FunctionDeclaration', params: params, id: {type: 'Identifier', name: ' '+funName},
        body: { type: 'BlockStatement',
            body: [_ifStatement, _returnStatement] },
        generator: false,
        async: false,
        expression: false

    };


    var _BlockStatement = {
        type: 'BlockStatement',
        body: [{type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: "original_"+funName}, init: null}], kind: 'var'},
            _stubFunDecl]};

    return _BlockStatement;



/*

    var _realFunction = escodegen.generate({
        type:  'BlockStatement',
        body: [{type: 'VariableDeclaration', declarations:[{type: 'VariableDeclarator', id: {type: 'Identifier', name: "original_"+funName}, init: null}], kind: 'var'},
            {type: 'FunctionDeclaration', params: [{type: 'Identifier', name: '_param'}], id: {type: 'Identifier', name:'real_'+funName}, body: { type: 'BlockStatement', body: [
                        {type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: '_var1'}, init: null}], kind: 'var'}]},
                generator: false,
                async: false,
                expression: false

            }]}

    );

    console.log("REACHED");
    return _realFunction;
*/


};

// generate stub for fully classified AssignmentExpression

exports.createStubFunctionExpression = function (funName, params, left) { // returns the code used as a replacement of the original code

    // function expression assignment

    var callLazyLoadStmt = 'lazyLoad(' + funName +', srcFile )';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);

/*
    var callEvalStmt = 'original_' + funName + ' = this.eval(cachedCode[' + funName + ']); ' + funName + ' = ' + 'original_' + funName + ';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;
*/


    var loadAndInvokeStmt = 'var loadedBody = loadAndInvoke(\"'+funName+'\", srcFile)';
    var _loadAndInvokeStmt = esprima.parse(loadAndInvokeStmt);

    var callEvalStmt = 'eval(\"original_'+funName+' = \" \+loadedBody); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;


    var ifStatement = 'if (original_' + funName + ' == null){' + callLazyLoadStmt + ';' + loadAndInvokeStmt + ';' +callEvalStmt + '}';



    // TODO :: RECTIFY THE NAME OF THE FUNCTION
//    var ifStatement = 'if (original_' + funName + ' == null){' + callLazyLoadStmt + ';' + callEvalStmt + '}';

    var _ifStatement = esprima.parse(ifStatement);
    var invokeStatement = 'return original_'+funName+ '.apply(this, _param);';
    _ifStatement['consequent'] = esprima.parse('lazyLoad(' + funName + ')   ;' + callEvalStmt).body[0];

    var paramList = [];
    if (params.length > 0 ){
        for (elem in params){
            console.log(params[elem]);
            paramList.push(params[elem].name);
        }
    }

    if(paramList.length > 0)
        var returnStatement = 'original_'+funName+'.apply(this, '+paramList.toString() +');';
    else
        var returnStatement = 'original_'+funName+'.apply(this);';
    var _returnStatement = esprima.parse(returnStatement);


    var _stubFunExpresison = {type: 'FunctionExpression', id : null, params : params,
        body: { type: 'BlockStatement',
            body: [
                 _ifStatement,_returnStatement]},
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
};
/*

function lazyLoadingFunction (funName, filePath){

    var lazyLoadingFunctionCode = ' function lazyLoad ( name ) { fs.readFileSync( '+ filePath + ', ) '

}*/


function lazyLoad(funName, fileName) {
    var code = fs.readFileSync(fileName, 'utf8');
   // console.log("code "+code);
    // TODO : Add the range and location code to the generated code
    var ast = esprima.parse(code.toString(), {range: true, loc: true, tokens: false});
    cachedCode[srcFile] = {};
    cutility.extractBodies(fileName);

}



var lazyLoadFunction = function lazyLoad(funName){
    var code = fs.readFileSync(srcFile);
    var ast = esprima.parse(code);
    cachedCode[srcFile] = {};
    estraverse.traverse(ast,   {
        enter: function (node, parent){ // check for function name and replace
            if (node.type == 'FunctionDeclaration') {
                var functionName = node.id.name;
                var functionBody = node.body;

                (cachedCode[srcFile])[functionName] = functionBody;

            }

            // lhs = function(){ }
            else if(node.type == 'ExpressionStatement'){
                //console.log('Expression');
                // console.log(node.expression);
                if(node.expression.type == 'AssignmentExpression'){
                    var left = node.expression.left;
                    var right = node.expression.right;
                    /*
                    If right is a FunctionExpression, get the  name of the function from the left
                     */
                    if(startLineNumber == node.loc.start.line) {
                        if (right.type == 'FunctionExpression') {
                            if (left.type == 'MemberExpression') {
                                console.log("The expression Statement");

                                // create a fully classified path for the function name
                                var leftVarBaseName = left.object.name;
                                var leftVarExtName = left.property.name;
                                var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                // console.log("Fully Classified Path "+leftVarPath);
                                // found the classified name of the function
                                var functionName = leftVarPath;
                                var functionBody  = right.body;
                                (cachedCode[srcFile])[functionName] = functionBody;


                            }
                        }
                    }
                }else{
                    estraverse.VisitorOption.skip;
                }
            }else{

                estraverse.VisitorOption.skip;
            }
        }

    });


}

function addCachedCodeDeclaration(ast){

    var cachedCodeString = 'var cachedCode = {};';
    var _cachedCodeString = esprima.parse(cachedCodeString.toString() ,{range: true, loc: true, tokens: true} );
    ast.body.unshift(_cachedCodeString);
    return ast;

}

exports.addCachedCodeDeclaration = addCachedCodeDeclaration;

// creates the body for the lazyLoading of the function funName
exports.createLazyLoad = function (funName) {

    var astForlazyLoad = esprima.parse(lazyLoad.toString(), {range: true, loc: true, tokens: true});
    console.log(escodegen.generate(astForlazyLoad));
    return astForlazyLoad;


};

exports.addHeaderInstructions = function (ast){
    var headerInstructions = 'var fs = require(\'fs\');\n' +
        'var esprima = require(\'esprima\');\n' +
        'var estraverse = require(\'estraverse\');\n' +
       // 'var cutility = require(\'./cutility.js\');\n' +
        'var escodegen = require(\'escodegen\');';

    var _headerInstructions = esprima.parse(headerInstructions.toString(), {range: true, loc : true, tokens: true});
    ast.body.unshift(_headerInstructions);
    return ast;

};

exports.addOriginalDeclaration = function(astForInput, functionName){
  var originalDeclaration = '';

  // simple function name
  if(functionName.toString().indexOf('.') === -1 ){
      originalDeclaration = originalDeclaration+' var original_'+functionName+ ' = null;';

  }else{
      //repalce a.b.c -> a_b_c
      var temp = functionName.replace(/\./g, '_');
      originalDeclaration = originalDeclaration+' var original_'+temp+ ' = null;'

  }

  var _originalDeclaration = esprima.parse(originalDeclaration.toString(), {range: true, loc : true, tokens: false});

  //return _originalDeclaration;
  estraverse.traverse(astForInput,
      {
         enter : function (node, parent){
             if (node.type == 'FunctionDeclaration') {
                 console.log("Function Node :: Declaration");
                 //console.log(node);
                 var functionName = node.id.name;
                 if(functionName === functionName){
                    // add the originalDeclaration statement
                     astForInput.body.unshift(_originalDeclaration);
                 }

             } else if (node.type == 'ExpressionStatement') {
                 console.log("Function Node :: Expression");
                 //console.log(node);

                 if (node.expression.type == 'AssignmentExpression') {
                     var left = node.expression.left;
                     var right = node.expression.right;
                     console.log("left  \t ");
                   //  console.log(left);

                     console.log("right \t");
                     //console.log(right);

                     if (right.type == 'FunctionExpression') {
                         if (left.type == 'MemberExpression') {
                             var leftVarBaseName = left.object.name;
                             var leftVarExtName = left.property.name;
                             var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                             var functionNameFull = leftVarPath;
                             if(functionNameFull === functionName){
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
         leave : function (node, parent){

             estraverse.VisitorOption.skip;

         }
      });

};

exports.addSrcfileDeclaration = function (astForInput, filename) {
    console.log("SRC "+filename);
    var srcFileDeclaration ='';
    var srcFileDeclaration = srcFileDeclaration+' var srcFile = \''+filename+ '.js\';';
    var _srcFileDeclaration = esprima.parse(srcFileDeclaration.toString(), {range: true, loc: true, tokens: false});

    // add just after the require statements
    astForInput.body.unshift(_srcFileDeclaration);



};

// a function which is invoked from the lazyLoad body
function extractBodies (srcFile) {
    var code = fs.readFileSync(srcFile, 'utf8');
    //console.log("code "+code);
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

exports.createExtractBodies = function(){
    var _astextractBodies = esprima.parse(extractBodies.toString(), {range: true, loc: true, tokens : false});
    return _astextractBodies;
    //ast.body.push(_astextractBodies);
};

function loadAndInvoke(funName, srcFile){
    for (var elem in cachedCode){
        if(cachedCode.hasOwnProperty(elem)){
            if(elem === srcFile){
                var functions = cachedCode[elem];
                for (var fun in functions){
                    if (functions.hasOwnProperty(fun)){
                        //var fun_i = eval(functions[fun]);
                        //console.log(fun_i);
                        if(fun === funName) {
                            console.log(functions[fun]);
                            return functions[fun];

                        }
                    }
                }

            }

        }
    }

}


exports.createLoadAndInvokeBody = function(){
    var _loadAndInvokeBody = esprima.parse(loadAndInvoke.toString(), {range: true, loc: true, tokens : false});
    return _loadAndInvokeBody;
    //ast.body.push(_astextractBodies);
};

// update require statements for the modified files

function updateRequireDeclaration (ast, globalModifiedFilesList){

    console.log(globalModifiedFilesList);
    console.log("Updating require declarations");
    estraverse.replace(ast,
        {  enter: function (node, parent) { // check for function name and replace
                if(node.type == 'VariableDeclarator'){
                    console.log("NODE");
                    console.log(node);
                    var id = node.id;
                    var init = node.init;
                    if(init.type == 'CallExpression'){
                        var callee = init.callee;
                        var callee_name = callee.name;
                        if(callee_name == 'require'){
                            console.log("Variable Declaration ");
                            console.log(node);

                            var requireAsrguments =  init.arguments;
                            if(Array.isArray(requireAsrguments)){
                                var args = [];
                                for(l in requireAsrguments){
                                    var currentLiteral = requireAsrguments[l].value;
                                    var prefix = currentLiteral.substring(0, currentLiteral.lastIndexOf('/')+1);
                                    var trimmedLiteral = currentLiteral.substring(currentLiteral.lastIndexOf('/')+1);

                                    // get the last name of
                                    if(globalModifiedFilesList.hasOwnProperty(trimmedLiteral)) {
                                        console.log("l " + trimmedLiteral);
                                        var newLiteralValue = globalModifiedFilesList[trimmedLiteral];
                                        console.log("new literal " + newLiteralValue);
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
                                //skip
                                estraverse.VisitorOption.skip;
                            }

                        }else{
                            //skip
                            estraverse.VisitorOption.skip;
                        }
                    }else{
                        // skip
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



     console.log("New Modified AST");
    // console.log(ast);
    var modfied_src = escodegen.generate(ast);
    console.log(modfied_src);
}

exports.updateRequireDeclaration = updateRequireDeclaration;

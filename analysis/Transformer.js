/*
 A module defining all major transofrmations for the original nodejs application.
 exports a bunch of APIs which can be used to find and replace a component of a given AST.
 Finally writes the modified files to the output directory provided by the user.

 @author Ashish
 */

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var utility = require('./Utility.js');
var fs = require('fs');

var exports = module.exports = {};

/*
A test transformer JS -> AST -> AST' -> JS'
 */
exports.replaceNaive = function(inputAST) {
    var inputProgram = 'var fs = require(fs); function testfunction(a, b){ var c = 0;  if ( c == 0 ) {} console.log(a + b + c); }';

    var inputProgramFromFile = fs.readFileSync("../tests/S2STransformer_1.js", 'utf8');
    console.log(inputProgramFromFile);
// must pass a string as the first argiment.
    var astForInput = esprima.parse(inputProgramFromFile.toString(), {range: true, loc: true, tokens: true});


// parse the ast and convert ast -> ast'
    var bundledFunctionInfo = {name: 'foo'};

    estraverse.traverse(astForInput,
        { // define the visitor as an object with two properties/functions defining task at enter and leave
            enter: function (node, parent) { // check for function name and replace
                if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
                    console.log("Function " + node.id.name);
                }
            },

            leave: function (node, parent) {
                if (node.type == 'VariableDeclarator') {

                    console.log("variable " + node.id.name);
                }
            }

        });

    var replace_bigger = {
        type: 'BlockStatement',
        body: [{
            type: 'VariableDeclaration',
            declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'originalFun'}, init: null}],
            kind: 'var'
        },
            {
                type: 'FunctionDeclaration',
                params: [{type: 'Identifier', name: '_param'}],
                id: {type: 'Identifier', name: 'replacedFun'},
                body: {
                    type: 'BlockStatement', body: [
                        {
                            type: 'VariableDeclaration',
                            declarations: [{
                                type: 'VariableDeclarator',
                                id: {type: 'Identifier', name: '_var1'},
                                init: null
                            }],
                            kind: 'var'
                        }]
                },
                generator: false,
                async: false,
                expression: false

            }]
    };
    var replace = {
        type: 'AssignmentPattern',
        left: {type: 'Identifier', name: 'replaced'},
        right: {
            type: 'FunctionDeclaration',
            params: [{type: 'Identifier', name: '_param'}],
            id: {type: 'Identifier', name: 'replacedFun'},
            body: {
                type: 'BlockStatement', body: [{
                    type: 'VariableDeclaration',
                    declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: '_var1'}, init: null}],
                    kind: 'var'
                }]
            },
            generator: false,
            async: false,
            expression: false
        }
    };


    var result = estraverse.replace(astForInput, {
        enter: function (node) {

            if (node.type == 'FunctionDeclaration') {
                if (node.id.name === '_foo') {
                    estraverse.VisitorOption.skip;
                } else {
                    if (node.id.name === 'foo')
                        return exports.createStubFunctionDeclaration(node.id.name);
                    else
                        estraverse.VisitorOption.skip;
                }
            }
            else if (node.type == 'FunctionExpression'){

            }
        }
    });

    console.log(astForInput);
    var final = escodegen.generate(astForInput);
    console.log("Final Program  ");
    console.log(final);

}


// replace function for a given  AST and a function name
exports.replace = function (ast, funName){
    console.log("Transforming the AST for the function " + funName);
    var result = estraverse.replace(ast, {
        enter: function (node) {

            if (node.type == 'FunctionDeclaration') {
                if (node.id.name == funName) {
                    return exports.createStubFunctionDeclaration(node.id.name);
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

exports.createStubFunctionDeclaration = function (funName){ // returns the code used as a replacement of the original code
    console.log("Creating stub for declaration");
    var _originalFunNameDecl = {type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'original_'+funName}, init: null}], kind: 'var'};
    var callLazyLoadStmt = 'lazyLoad('+funName+')';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);


    var ifStatement = 'if (original_'+funName+' == null){'+callLazyLoadStmt+ ';' +callEvalStmt+ '}';
    var _ifStatement = esprima.parse(ifStatement);

    var callEvalStmt = 'original_'+funName+' = this.eval(cachedCode['+funName+']); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;

    var returnStatement = 'original_'+funName+'.apply(this,_param);';
    var _returnStatement = esprima.parse(returnStatement);

    _ifStatement['consequent'] = esprima.parse('lazyLoad('+funName+');'+callEvalStmt).body[0];

    /*  console.log()
      console.log("CALL STMT");
      console.log(_callEvalStmt);
  */
    var _stubFunDecl = {type: 'FunctionDeclaration', params: [{type: 'Identifier', name: '_param'}], id: {type: 'Identifier', name: '_'+funName},
        body: { type: 'BlockStatement',
            body: [
                {type: 'VariableDeclaration',
                    declarations: [{type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: '_var1'}, init: null}
                    ], kind: 'var'}, _ifStatement] },
        generator: false,
        async: false,
        expression: false

    };

    // create an if statement


    var _BlockStatement = {
        type: 'BlockStatement',
        body: [{type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: "original_"+funName}, init: null}], kind: 'var'},
            _stubFunDecl, _returnStatement]};

    return _BlockStatement;

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

    return _realFunction;


}

// generate stub for fully classified AssignmentExpression

exports.createStubFunctionExpression = function (funName, params, left) { // returns the code used as a replacement of the original code

    // function expression assignment

    var callLazyLoadStmt = 'lazyLoad(' + funName + ')';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);

    var callEvalStmt = 'original_' + funName + ' = this.eval(cachedCode[' + funName + ']); ' + funName + ' = ' + 'original_' + funName + ';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;
    var ifStatement = 'if (original_' + funName + ' == null){' + callLazyLoadStmt + ';' + callEvalStmt + '}';

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
                {type: 'VariableDeclaration',
                    declarations: [{type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: '_var1'}, init: null}
                    ], kind: 'var'}, _ifStatement,_returnStatement]},
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
// create a function body which keeps track of

/*

function lazyLoadingFunction (funName, filePath){

    var lazyLoadingFunctionCode = ' function lazyLoad ( name ) { fs.readFileSync( '+ filePath + ', ) '

}*/

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

// creates the body for the lazyLoading of the function funName
exports.createLazyLoad = function (funName) {

    var astForlazyLoad = esprima.parse(lazyLoadFunction.toString(), {range: true, loc: true, tokens: true});
    console.log("AST for lazy Load");
    console.log(astForlazyLoad);



}

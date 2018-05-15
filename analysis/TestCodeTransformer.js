var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var utility = require('./Utility.js');
var fs = require('fs');

var exports = module.exports = {};

/*
A test transformer JS -> AST -> AST' -> JS'
 */
// small program
var inputProgram = 'var fs = require(fs); function testfunction(a, b){ var c = 0;  if ( c == 0 ) {} console.log(a + b + c); }';

var inputProgramFromFile = fs.readFileSync("../tests/S2STransformer_1.js", 'utf8');
console.log(inputProgramFromFile);
// must pass a string as the first argiment.
var astForInput = esprima.parse(inputProgramFromFile.toString(), {range : true, loc : true, tokens : true});
console.log("AST");
console.log(astForInput);

// parse the ast and convert ast -> ast'
var bundledFunctionInfo = {name: 'foo' };

estraverse.traverse(astForInput,
    { // define the visitor as an object with two properties/functions defining task at enter and leave
        enter: function (node, parent){ // check for function name and replace
            if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration'){
                console.log("Function "+node.id.name);
                console.log(node.loc);
                console.log("function start "+ node.loc.start.line);
            }
        },

        leave: function (node, parent){
                if (node.type == 'VariableDeclarator'){

                    console.log("variable "+node.id.name);
                }
        }

    });

var replace_bigger = {
    type:  'BlockStatement',
    body: [{type: 'VariableDeclaration', declarations:[{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'originalFun'}, init: null}], kind: 'var'},
        {type: 'FunctionDeclaration', params: [{type: 'Identifier', name: '_param'}], id: {type: 'Identifier', name:'replacedFun'}, body: { type: 'BlockStatement', body: [
                    {type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: '_var1'}, init: null}], kind: 'var'}]},
            generator: false,
            async: false,
            expression: false

        }]};
var replace = {
    type: 'AssignmentPattern',
    left:  {type: 'Identifier', name: 'replaced'},
    right: { type: 'FunctionDeclaration',
        params: [{type: 'Identifier', name: '_param'}],
        id: {type: 'Identifier', name:'replacedFun'},
        body: {type: 'BlockStatement', body:[{type: 'VariableDeclaration',
            declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: '_var1'}, init: null}], kind: 'var'}]},
        generator: false,
        async: false,
        expression: false
    }};


var result =  estraverse.replace(astForInput, {
    enter: function (node) {

        if( node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration'){
            if(node.id.name === '_foo'){
                estraverse.VisitorOption.skip;
            }else {
                if(node.id.name === 'foo')
                    return createStub(node.id.name);
                else
                    estraverse.VisitorOption.skip;
            }
        }
    }
});

console.log(astForInput);
var final = escodegen.generate(astForInput);
console.log("Final Program  ");
console.log(final);


function createStub (funName){ // returns the code used as a replacement of the original code

    var _originalFunNameDecl = {type: 'VariableDeclaration', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'original_'+funName}, init: null}], kind: 'var'};
    var callLazyLoadStmt = 'lazyLoad('+funName+')';
    var _callLazyLoadStmt = esprima.parse(callLazyLoadStmt);

    var callEvalStmt = 'original_'+funName+' = this.eval(cachedCode['+funName+']); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;

    var ifStatement = 'if (original_'+funName+' == null){'+callLazyLoadStmt+ ';' +callEvalStmt+ '}';

    var _ifStatement = esprima.parse(ifStatement);

    var callEvalStmt = 'original_'+funName+' = this.eval(cachedCode['+funName+']); '+funName+' = '+'original_'+funName+';';
    var _callEvalStmt = esprima.parse(callEvalStmt).body;

    _ifStatement['consequent'] = esprima.parse('lazyLoad('+funName+');'+callEvalStmt).body[0];
    //_ifStatement['consequent']
    console.log()
    console.log("CALL STMT");
    console.log(_callEvalStmt);

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
            _stubFunDecl, _callEvalStmt[0], _callEvalStmt[1]]};

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

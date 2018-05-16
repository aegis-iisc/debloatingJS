// DO not remove the following comment

/*
*@author Ashish Mishra
*/


//var stubFinder = require("./CheckModuleLoading.js");
// keeps the loaded_function name, fileName, functionBody.


/*
    Source to Source Transformation algorithm
    for file in nodeProject
        for f in file
            if f in StubbingList && f.size >= threshold{
                replace f with f_in_file_STUB

            }else
                skip f


 */
var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var utility = require('./Utility.js');
var fs = require('fs');
var loadedFunctions = {};
var argparse = require('argparse');
var arguments =  process.argv.slice(2);
var transformer = require('./Transformer.js');

var fileName_Func_Location = {};

var parser = new argparse.ArgumentParser({
    version : 0.1,
    addHelp : true,
    description : "The source to source transformer for the feature reduction of JS"

});

parser.addArgument(['-sl'], {help: 'potential stub list' } );
parser.addArgument(['-in'], {help: 'input path, the directory containing files to be transofrmed' });
parser.addArgument(['-o'], {help: 'output path, the directory where transformed files are written' });
var args = parser.parseArgs();
if(!args.sl || !args.in || !args.o){
    console.log("ERROR: Insufficient inputs, try -h option");
}

//  console.log("Args "+args.toString());


var stubbingFuncList = args.sl;
var pathToRoot = args.in;
var pathToOutput = args.o;


console.log("stub List "+stubbingFuncList);
console.log("pathToRoot "+pathToRoot);

readStubListJSON(stubbingFuncList)

console.log(fileName_Func_Location);

transformUncovered(fileName_Func_Location);


// build an ast for the JS and replace the functions in the fileName_Funct_Location map

// look at the file name from the fileName_Func_Location, and replace the function with the stub.
// TODO : FileInput -> JSONInput
function transformUncovered (fileName_Func_Loctaion){
    for (elem in fileName_Func_Location){
        console.log(elem);
        try {
            var fileName = fileName_Func_Location[elem].fileName;
            var location = fileName_Func_Location[elem].funcLoc;
            var startLineNumber = location.toString().split(':')[0];
            if (startLineNumber == 1) {
                continue;
            }
            var functionName = findFun(fileName, location, startLineNumber);
            console.log("Function Name " + functionName);

            var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
            var astForInput = esprima.parse(inputProgramFromFile.toString(), {range: true, loc: true, tokens: true});


            // replace function body with stubs
            transformer.replace(astForInput, functionName);

            // add the body for the lazyLoading Function

            transformer.createLazyLoad(functionName);

            console.log('################################## MODIFIED ##########################');
            //console.log(astForInput);
            var final = escodegen.generate(astForInput);
            console.log("Final Program  ");
            console.log(final);

            // write the output program to a file.
            try{
                var f = fileName.replace(/([a-z]|[A-Z]|[0-9])\//g, '-' );
                console.log("fileName-to-be-written "+f);
                fs.writeFileSync(pathToOutput+f+'.js', final);
            }catch(Fileerror){
                console.log("File Error "+Fileerror.stack);
            }


        }catch(error) {
            console.log(error.stack);

        }

        console.log('___________________________________________________________');
        //btransformer.createStub()

    }

}
// location = [a:b:c:d]
// a := start line number, b : column info for start, c : end line number, d : column info for end
function findFun(fileName, location, startLineNumber) {
    console.log('finding the function at '+location+ ' at line '+startLineNumber+ ' in file '+fileName);
    var _fn = fileName.toString();
    var _loc = location;
    var result = null;

    if(_fn.length > 0){
        console.log(_fn);
        var inputProgramFromFile = fs.readFileSync(_fn+'.js', 'utf8');
        // must pass a string as the first argiment.
        var astForInput = esprima.parse(inputProgramFromFile.toString(), {range : true, loc : true, tokens : true});
        //console.log("AST for the file");
        // traverse the tree.
        estraverse.traverse(astForInput,
            { // define the visitor as an object with two properties/functions defining task at enter and leave
                enter: function (node, parent){ // check for function name and replace
                    if (node.type == 'FunctionDeclaration') {
                        console.log("Node ");
                        // console.log(node);
                        console.log("Function " + node.id.name);
                        console.log(node.loc);
                        console.log("function start " + node.loc.start.line);

                        if(startLineNumber == node.loc.start.line){
                            // found the function name .
                            result = node.id.name;
                            this.break();

                        }
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
                                        console.log(node);
                                        // create a fully classified path for the function name
                                        var leftVarBaseName = left.object.name;
                                        var leftVarExtName = left.property.name;
                                        var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                        // console.log("Fully Classified Path "+leftVarPath);
                                        // found the classified name of the function
                                        result = leftVarPath;
                                        this.break();

                                    }
                                }
                            }
                        }else{
                            estraverse.VisitorOption.skip;
                        }
                    }
                },

                leave: function (node, parent){
                    if (node.type == 'VariableDeclarator'){
                        estraverse.VisitorOption.skip;
                        //console.log("variable "+node.id.name);
                    }
                }

            });
        // traverse the file


    }else {
        console.log("Error : Not a javascript file "+_fn.substring(_fn.indexOf('.')+1,_fn.length));

    }

    console.log("Returned function name "+result);
    if (result != null)
        return result;
    else
        console.log("No function found for the input file and location");



}

// with JSON input this becomes unused
function splitStubFile(){

    var buffer = fs.readFileSync(stubbingFuncList );
    console.log("file "+ buffer);
    var dataAsArray = buffer.toString().split("\n");
    console.log(dataAsArray.toString());
    for (elem in dataAsArray){
        var temp = dataAsArray[elem].substring(1, dataAsArray[elem].length -1);
        var filePath_LineNo = temp.split(".js:");
        fileName_Func_Location[elem] = {fileName : filePath_LineNo[0], funcLoc : filePath_LineNo[1]};
        //console.log(fileName_Func_Location);
    }

}
// read the JSON file and create a fileName and function Location to be replaced by stubs
function readStubListJSON(jsonFileName){

    var obj = JSON.parse(fs.readFileSync(jsonFileName, 'utf8'));
    console.log("StubList "+JSON.stringify(obj));
    for (elem in obj){
        var stubLoction_elem = obj[elem].stubLocation;
        var temp = stubLoction_elem.substring(1, stubLoction_elem.length -1);
        var filePath_LineNo = temp.split(".js:");
        fileName_Func_Location[elem] = {fileName : filePath_LineNo[0], funcLoc : filePath_LineNo[1]};

    }

}
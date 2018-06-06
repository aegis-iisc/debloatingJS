// DO not remove the following comment

/*
*@author Ashish Mishra
*/


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

(function () {
    var stubbingFuncList = args.sl;
    var pathToRoot = args.in;
    var pathToOutput = args.o;
    var globalModifiedFilesList = {};
    readStubListJSON(stubbingFuncList);
    populateGlobalModifiedFilesList(fileName_Func_Location);

    transformUncovered(fileName_Func_Location);


// build an ast for the JS and replace the functions in the fileName_Funct_Location map

// TODO : FileInput -> JSONInput // done
    function transformUncovered(fileName_Func_Loctaion) {
        var updatedASTList = {};
        for (elem in fileName_Func_Location) {
            try {
                var fileName = fileName_Func_Location[elem].fileName;
                var location = fileName_Func_Location[elem].funcLoc;
                var startLineNumber = location.toString().split(':')[0];
                var functionName = findFun(fileName, location, startLineNumber);

                // if the AST is already modified, start from the modified AST
                var astForInput = {};
                if(updatedASTList.hasOwnProperty(fileName)) {
                    astForInput = updatedASTList[fileName];
                }
                else { // performed once
                    var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
                    astForInput = esprima.parse(inputProgramFromFile.toString(), {
                        range: true,
                        loc: true,
                        tokens: true
                    });
                    transformer.addCachedCodeDeclaration(astForInput);
                    // Bunch of generic import instruction
                    transformer.addHeaderInstructions(astForInput);
                    transformer.addSrcfileDeclaration(astForInput, fileName);

                    var astForLazyLoad = transformer.createLazyLoad(functionName);
                    astForInput.body.push(astForLazyLoad);
                    var astForExtractBody = transformer.createExtractBodies();
                    astForInput.body.push(astForExtractBody);

                    transformer.updateRequireDeclaration(astForInput, globalModifiedFilesList);
                    var astForLoadAndInvokeBody = transformer.createLoadAndInvokeBody();
                    astForInput.body.push(astForLoadAndInvokeBody);

                }

                 //transformer.addOriginalDeclaration(astForInput, functionName);
                 transformer.replace(astForInput, functionName);
                // create and add a body for lazy Loading
                var modifiedProgram = escodegen.generate(astForInput);
                updatedASTList[fileName] = astForInput;

            }
            catch (error) {
                console.log(error.stack);

            }

        }

        try {
            for(fileN in updatedASTList){
                var trimmedFileN = fileN.substring(fileN.lastIndexOf('/')+1);
                var f= trimmedFileN.replace(/([a-z]|[A-Z]|[0-9])\//g, '-');
                console.log("fileName-to-be-written " + f+'_modified.js');
                fs.writeFileSync(pathToOutput + f + '_modified.js', escodegen.generate(updatedASTList[fileN]));
            }
                       } catch (Fileerror) {
            console.log("File Error " + Fileerror.stack);
        }
   }

// location = [a:b:c:d]
// a := start line number, b : column info for start, c : end line number, d : column info for end
    function findFun(fileName, location, startLineNumber) {
        var _fn = fileName.toString();
        var _loc = location;
        var result = null;

        if (_fn.length > 0) {
            var inputProgramFromFile = fs.readFileSync(_fn + '.js', 'utf8');
            var astForInput = esprima.parse(inputProgramFromFile.toString(), {range: true, loc: true, tokens: true});
            estraverse.traverse(astForInput,
                { // define the visitor as an object with two properties/functions defining task at enter and leave
                    enter: function (node, parent) { // check for function name and replace
                        if (node.type == 'FunctionDeclaration') {
                            if (startLineNumber == node.loc.start.line) {
                                // found the function name .
                                result = node.id.name;
                                this.break();

                            }
                        }
                        // lhs = function(){ }
                        else if (node.type == 'ExpressionStatement') {
                            if (node.expression.type == 'AssignmentExpression') {
                                var left = node.expression.left;
                                var right = node.expression.right;
                                /*
                                If right is a FunctionExpression, get the  name of the function from the left
                                 */
                                if (startLineNumber == node.loc.start.line) {
                                    if (right.type == 'FunctionExpression') {
                                        if (left.type == 'MemberExpression') {
                                            var leftVarBaseName = left.object.name;
                                            var leftVarExtName = left.property.name;
                                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                            result = leftVarPath;
                                            this.break();

                                        }
                                    }
                                }
                            } else {
                                estraverse.VisitorOption.skip;
                            }
                        }
                    },

                    leave: function (node, parent) {
                        if (node.type == 'VariableDeclarator') {
                            estraverse.VisitorOption.skip;
                            //console.log("variable "+node.id.name);
                        }
                    }

                });
            // traverse the file


        } else {
            console.log("Error : Not a javascript file " + _fn.substring(_fn.indexOf('.') + 1, _fn.length));

        }

        console.log("Returned function name " + result);
        if (result != null)
            return result;
        else
            console.log("No function found for the input file and location");


    }

// with JSON input this becomes unused
    function splitStubFile() {

        var buffer = fs.readFileSync(stubbingFuncList);
        console.log("file " + buffer);
        var dataAsArray = buffer.toString().split("\n");
        console.log(dataAsArray.toString());
        for (elem in dataAsArray) {
            var temp = dataAsArray[elem].substring(1, dataAsArray[elem].length - 1);
            var filePath_LineNo = temp.split(".js:");
            fileName_Func_Location[elem] = {fileName: filePath_LineNo[0], funcLoc: filePath_LineNo[1]};
            //console.log(fileName_Func_Location);
        }

    }

// read the JSON file and create a fileName and function Location to be replaced by stubs
    function readStubListJSON(jsonFileName) {

        var obj = JSON.parse(fs.readFileSync(jsonFileName, 'utf8'));
        //console.log("StubList " + JSON.stringify(obj));
        for (elem in obj) {
            var stubLoction_elem = obj[elem].stubLocation;
            var temp = stubLoction_elem.substring(1, stubLoction_elem.length - 1);
            var filePath_LineNo = temp.split(".js:");
            fileName_Func_Location[elem] = {fileName: filePath_LineNo[0], funcLoc: filePath_LineNo[1]};

        }

    }

    function populateGlobalModifiedFilesList(fileName_Func_Location){

        for (elem in fileName_Func_Location){
            try {
                var fileName = fileName_Func_Location[elem].fileName;
                var fileNameRelative =fileName.substring(fileName.lastIndexOf('/')+1, fileName.length);
                globalModifiedFilesList[fileNameRelative+'.js'] = fileNameRelative+ '_modified.js';
            }catch (error){
                console.error(error.toString());
            }

            }

    }

}());
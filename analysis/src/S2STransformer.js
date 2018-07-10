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
var esquery = require('esquery');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var utility = require('./Utility.js');
var fs = require('fs');
var loadedFunctions = {};
var argparse = require('argparse');
var arguments =  process.argv.slice(2);
var transformer = require('./Transformer.js');
var copydir = require('copy-dir');
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


const NO_CHANGES_NEEDED = 'NO-STUB';
const LOCATION_DELTA_THRESSHOLD = 2;
//  console.log("Args "+args.toString());

(function () {
    var stubbingFuncList = args.sl;
    var pathToRoot = args.in;
    var pathToOutput = args.o;
    var globalModifiedFilesList = {};
    readStubListJSON(stubbingFuncList);
    populateGlobalModifiedFilesList(fileName_Func_Location);
    var changes  = transformUncovered(fileName_Func_Location);
    if(changes === NO_CHANGES_NEEDED){
        console.log("No changes in the file");
        var outPutFile = stubbingFuncList.substring(0, stubbingFuncList.indexOf('_stubList.json'));
        console.log("output file "+outPutFile);
        var iFPath = outPutFile.replace('output-actual','input');
        console.log("input file "+iFPath);

        //copy the original file to the modified;
        // TODO try catch
        fs.createReadStream(iFPath+'.js').pipe(fs.createWriteStream(outPutFile+'_modified.js'));

    }

// build an ast for the JS and replace the functions in the fileName_Funct_Location map

// TODO : FileInput -> JSONInput // done
    function transformUncovered(fileName_Func_Loctaion) {
        var updatedASTList = {};
        // if no stub generated the transformed file is similar to original and return;
        if (Object.keys(fileName_Func_Loctaion).length === 0 && fileName_Func_Loctaion.constructor === Object) {
            console.error("Empty StubList");
            return NO_CHANGES_NEEDED;

        }
        for (elem in fileName_Func_Location) {
            try {
                var fileName = fileName_Func_Location[elem].fileName;
                var location = fileName_Func_Location[elem].funcLoc;
                var startLineNumber = location[0];
                var functionName = findFun(fileName, location, startLineNumber);

                if (functionName === undefined)
                    throw "function Name could not be found";
                // if the AST is already modified, start from the modified AST
                var astForInput = {};
                if (updatedASTList.hasOwnProperty(fileName)) {
                    astForInput = updatedASTList[fileName];
                } else { // performed once
                    var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
                    astForInput = esprima.parse(inputProgramFromFile.toString(), {
                        range: true,
                        loc: true,
                        tokens: true
                    });
                    transformer.addCachedCodeDeclaration(astForInput);
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
                //console.log("functionName "+functionName);
                if (functionName.type == utility.UNIQUE_ID_TYPE) {
                    console.log("REPLACE :: Anonymous Function");
                    transformer.replace(astForInput, null, functionName);
                    // create and add a body for lazy Loading
                    var modifiedProgram = escodegen.generate(astForInput);
                    updatedASTList[fileName] = astForInput;


                } else {

                    transformer.replace(astForInput, functionName);
                    // create and add a body for lazy Loading
                    var modifiedProgram = escodegen.generate(astForInput);
                    updatedASTList[fileName] = astForInput;
                }
            }
            catch (error) {
                console.log(error.stack);

            }

        }

        try {
            for(fileN in updatedASTList){
                var trimmedFileN = fileN.substring(fileN.lastIndexOf('/')+1);
                var f= trimmedFileN.replace(/([a-z]|[A-Z]|[0-9])\//g, '-');
                console.log("path "+pathToOutput);

                console.log("fileName-to-be-written " +pathToOutput + f+'_modified.js');
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

        console.log('*** location: ' + location);

        if (_fn.length > 0) {
            var inputProgramFromFile = fs.readFileSync(_fn + '.js', 'utf8');
            var astForInput = esprima.parse(inputProgramFromFile.toString(), {range: true, loc: true, tokens: false});


            estraverse.traverse(astForInput,
                { // define the visitor as an object with two properties/functions defining task at enter and leave
                    enter: function (node, parent) { // check for function name and replace
                        if (node.type === 'FunctionDeclaration') {
                            if (startLineNumber === node.loc.start.line.toString()) {
                                // found the function name .
                                result = node.id.name;
                                this.break();
                            }
                        } // lhs = function(){ }
                        else if (node.type === 'ExpressionStatement') {
                            if (node.expression.type === 'AssignmentExpression') {
                                var left = node.expression.left;
                                var right = node.expression.right;

                                if (startLineNumber === node.loc.start.line) {
                                    if (right.type === 'FunctionExpression') {
                                        // lhs = MemberExpression rhs = FunctionExpression

                                        if (left.type === 'MemberExpression') {
                                            var leftVarBaseName = left.object.name;
                                            var leftVarExtName = left.property.name;
                                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                            result = leftVarPath;
                                            this.break();

                                        }
                                        // lhs = Identifier , rhs = function expression
                                        else if(left.type === 'Identifier'){
                                            if(left.name){
                                                var functionName = left.name;
                                                result = functionName;
                                                this.break();
                                            }else{

                                                throw("No name of the Identifier ");
                                            }

                                        }
                                        // TODO : Handle other cases
                                        else{
                                            estraverse.VisitorOption.skip;
                                        }
                                    }
                                }else{
                                    estraverse.VisitorOption.skip;

                                }
                            } else if(node.expression.type === 'FunctionExpression'){
                                if(node.loc.start.line == startLineNumber){
                                    var functionID = node.expression.id;
                                    if(functionID !== null){
                                        var funExpName = functionID.name;
                                        result = funExpName;
                                        this.break();

                                    }
                                } else{
                                    estraverse.VisitorOption.skip;

                                }
                            } else if(node.expression.type === 'ObjectExpression'){
                                estraverse.VisitorOption.skip;
                            }else if(node.expression.type === 'ArrowFunctionExpression'){

                                estraverse.VisitorOption.skip;

                            }else if(node.expression.type === 'CallExpression'){
                                estraverse.VisitorOption.skip;

                            }

                            else {
                                estraverse.VisitorOption.skip;
                            }
                        }else if(node.type === 'CallExpression'){
                            /*   console.log("node type callExpression");
                               console.log(node);
   */
                        }else if(node.type === 'FunctionExpression') {
                            //compare the location
                            console.log("anonymous function location");
                            console.log(_loc);
                            // console.log(node);
                            /*Temporary logic: The location of the function as given by Jalangi differs than the location generated by esprima module
                            * A more flexible comparision \ls - la\ <= thresshold
                             */
                            console.log("ERROR "+node.loc.start.column+" - "+_loc[1]+ " = "+  Math.abs(node.loc.start.column -_loc[1]));
                            if( node.loc.start.line === _loc[0] && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)){
                                //if (node.loc.start.line === _loc[0] && node.loc.start.column === _loc[2]){
                                if (node.id !== null) {// has an id
                                    console.log("FE NOT NULL ");
                                    result = node.id.name;
                                    this.break();
                                } else {
                                    console.log("FE NULL");
                                    result = utility.cerateUniqueId(node.loc);
                                    this.break();
                                }
                            }
                        }

                        else{
                            estraverse.VisitorOption.skip;
                        }
                    },

                    leave: function (node, parent) {
                        // console.log("leaving");
                        // console.log(node);
                        // if (node.type == 'VariableDeclarator') {
                        //     estraverse.VisitorOption.skip;
                        //     //console.log("variable "+node.id.name);
                        // }
                    }

                });
            // traverse the file


        } else {
            console.log("Error : Not a javascript file " + _fn.substring(_fn.indexOf('.') + 1, _fn.length));

        }

        console.log("Returned function name " + result);
        if (result !== null)
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
            var locArray = filePath_LineNo[1].split(':');

            console.log("Type of location "+typeof  locArray);
            console.log(locArray);

           // fileName_Func_Location[elem] = {fileName: filePath_LineNo[0], funcLoc: filePath_LineNo[1]};
            fileName_Func_Location[elem] = {fileName: filePath_LineNo[0], funcLoc: locArray};
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
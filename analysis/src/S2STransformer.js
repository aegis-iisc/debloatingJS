/*
*@author Ashish Mishra
*/

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var utility = require('./Utility.js');
var fs = require('fs');
var argparse = require('argparse');
var transformer = require('./Transformer.js');
var copydir = require('copy-dir');
const path = require('path');
var mkdirp = require('mkdirp');
const IgnoreFunction = 'IgnoreFunction';


// records for each fileName f, an array of function locations to be replaced by stubs
var fileName_Func_Location = {};
var globalModifiedFilesList = {};

var parser = new argparse.ArgumentParser({
    version : 0.1,
    addHelp : true,
    description : "The source to source transformer for the feature reduction of JS"
});

parser.addArgument(['-sl'], {help: 'potential stub list' } );
parser.addArgument(['-in'], {help: 'input path, the directory containing files to be transofrmed' });
parser.addArgument(['-o'], {help: 'output path, the directory where transformed files are written' });
parser.addArgument(['-log'], {help: 'logfile for writing stub Expansion Info'});
parser.addArgument(['-isNode'], {help: 'true if the input is a node, -in will be the root directory of the node app ' +
    'and -o will the root directory for the app in the output-actual'});

var args = parser.parseArgs();
// verify the argumensts
if(!args.sl || !args.in || !args.o){
    console.log("ERROR: Insufficient inputs, try -h option");
}

const NO_CHANGES_NEEDED = 'NO-STUB';
const LOCATION_DELTA_THRESSHOLD = 2;

(function () {
    console.log('S2S Transformation Called');

    var isNode = false;
    if(!args.isNode || args.isNode === false || args.isNode === 'false') { // unit application case
        var stubListFile = path.resolve(args.sl);
        var pathToRoot = path.resolve(args.in);
        var pathToOutput = path.resolve(args.o);
        preprocessInput(stubListFile);
        if(args.log)
            var changes = mainTransformer(fileName_Func_Location, pathToOutput, args.log);
        else
            var changes = mainTransformer(fileName_Func_Location, pathToOutput);
        if (changes === NO_CHANGES_NEEDED)
            generateModifiedAsOriginal(stubListFile);

        return;
    }else{ // node js case
        isNode = true;
        var stubListFile = path.resolve(args.sl);
        var inputAppDir = path.resolve(args.in);
        var outputAppDir = path.resolve(args.o);
        preprocessInput(stubListFile);
        if(args.log)
            var changes = mainTransformer(fileName_Func_Location, outputAppDir, args.log);
        else
            var changes = mainTransformer(fileName_Func_Location, outputAppDir);
        if (changes === NO_CHANGES_NEEDED)
            generateModifiedAsOriginal(stubListFile);
        console.log('Transformation Finished');
        return;
    }
}());


function generateModifiedAsOriginal(stubFile){ // File -> File -> ()



    //console.log("No changes in the file, keeping the original file");
    var outputPathDir = path.dirname(stubFile);
    var inputPathDir = path.resolve(outputPathDir.toString().replace('output-actual','input'));

    if(inputPathDir.toString().indexOf(path.sep+'input'+path.sep) === -1){
        console.error("Input path does not contain /input/");

    }


    /*/!********** Copy the original Application to the Target *******************!/

    // copy the directory structure of the input application to the actual output-directory
    createDirectoryStructure(inputPathDir, outputPathDir);



*/
    /*var stubFileBase = path.basename(stubFile);
    var basefileName = getActualPath(stubFileBase);
    var basefileModified = getModifiedPath(basefileName); //Identity fn now
    var outputFilePath = path.join(outputPathDir, basefileModified);
    var inputFilePath = path.join(inputPathDir, basefileName);

    try{
        console.log("writing "+inputFilePath+ " to "+outputFilePath);
        fs.createReadStream(inputFilePath).pipe(fs.createWriteStream(outputFilePath));

    }catch (error) {
        console.error(error);
    }*/
}


function getActualPath(_outPath){
    return _outPath.replace('_out.json','.js');

}

function getModifiedPath(_fileName){
   return  _fileName;
}
/* preprocesses the input, read the stubList,
 *  populates the fineName_Func_Location
 * populates the globalModifiedFileList
 * @params stubFile :  The json file containing the list of potentially stub-able functions
 */
function preprocessInput(stubFile){ // file -> Map -> ()
    fileName_Func_Location = readStubListJSON(stubFile);
    globalModifiedFilesList = populateGlobalModifiedFilesList(fileName_Func_Location);
}

// read the JSON file and create a fileName and function Location to be replaced by stubs
function readStubListJSON(outFileJSON) {
    var obj = JSON.parse(fs.readFileSync(outFileJSON, 'utf8'));
    // an Array [{stubLocation : }, {stubLocation: },]
    var unexecutedFunctions = obj.unexecutedFunctions;

    for(var i = 0 ; i< unexecutedFunctions.length ; i++){
        var stubLoction_elem = unexecutedFunctions[i].stubLocation;
        var filePath_LineNo = stubLoction_elem.split(".js:");
        var locArray = filePath_LineNo[1].split(':');
        fileName_Func_Location[i] = {fileName: filePath_LineNo[0], funcLoc: locArray};

    }
    return fileName_Func_Location;
}
/*
 * Main code transformer function
 * Runs the code transformation for each potentially stub
 */
function mainTransformer(fileName_Func_Loctaion, pathToOutput, logfile) {
    console.log('Running Main Transformer');
    var updatedASTList = {};
    // if no stub generated the transformed file is similar to original and return;
    //TODO : why constructor === Object
    if (Object.keys(fileName_Func_Loctaion).length === 0 && fileName_Func_Loctaion.constructor === Object) {
        console.error("No potentially unreachble functions found by the analysis");
        return NO_CHANGES_NEEDED;
    }
    for (elem in fileName_Func_Location) {
        try {
            var fileName = fileName_Func_Location[elem].fileName;
            var location = fileName_Func_Location[elem].funcLoc;
            var startLineNumber = location[0];

            // Ignore the files outside the input project directory
            var filePath = path.resolve(fileName);
            if((filePath.toString().indexOf(path.sep+'input'+path.sep) === -1)
                || (filePath.toString().indexOf(path.sep+'node_modules'+path.sep+'mocha'+path.sep) > -1)
                    || (filePath.toString().indexOf(path.sep+'debloatingJS'+path.sep) > -1 )
                        || (filePath.toString().indexOf(path.sep+'node_modules'+path.sep+'chai'+path.sep) > -1)
                            || (filePath.toString().indexOf('.min') > -1)
                                || (filePath.toString().indexOf('-min') > -1)){
                //console.log("/input/ assumption :: Skipping transformation "+filePath);
                continue;
            }
            if(path.resolve(fileName).toString().indexOf(path.sep+'node_modules'+path.sep+'mocha'+path.sep) > -1){
                console.log("/node_modules/mocha assumption");
                continue;
            }

            var functionName = findFun(fileName, location, startLineNumber);

            if (!functionName) {
                utility.printObjWithMsg(location+'@'+fileName, 'NOT FOUND');
                throw "function Name could not be found";
            }
            var astForInput = {};
            if (updatedASTList.hasOwnProperty(fileName)) {
                astForInput = updatedASTList[fileName];
            }else{ // performed once
                var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
                astForInput = esprima.parseModule(inputProgramFromFile.toString(), {
                    range: true,
                    loc: true,
                    tokens: true,
                    ecmaVersion: 6
                });
                // set the   fileName
                astForInput.attr = {'fileName': fileName+'.js'};
                transformer.addCachedCodeDeclaration(astForInput);
                transformer.addHeaderInstructions(astForInput);
                transformer.addSrcfileDeclaration(astForInput, fileName);
             }


             if (functionName.type == utility.UNIQUE_ID_TYPE) {
                if(logfile)
                    transformer.replace(astForInput, null, functionName, logfile);
                else
                    transformer.replace(astForInput, null, functionName);
                // create and add a body for lazy Loading
                var modifiedProgram = escodegen.generate(astForInput);

            }else{
              if(logfile)
                  transformer.replace(astForInput, functionName, null, logfile);
              else
                 transformer.replace(astForInput, functionName, null);
                // create and add a body for lazy Loading
               var modifiedProgram = escodegen.generate(astForInput);

            }
            updatedASTList[fileName] = astForInput;
        }
        catch (error) {
            //console.log('2');

           console.error('[Error:: S2STransformer] '+error);

        }

    }

    try {
        // writing the modified files corresponding to the changed original file
        for(fileN in updatedASTList){
            var baseFileName = path.basename(fileN);
            var fullOriginalPath = path.resolve(fileN);

            if(fullOriginalPath.toString().indexOf(path.sep+'input'+path.sep) === -1){
                console.log("Input path does not contain /input/");
                continue;

            }
            var fullModifiedPath = path.resolve(fullOriginalPath.toString().replace('input', 'output-actual') + '.js');
             mkdirp.sync(path.dirname(fullModifiedPath));
             utility.printObjWithMsg(fullModifiedPath, 'Writing Transformed');
            fs.writeFileSync(fullModifiedPath, escodegen.generate(updatedASTList[fileN]));
        }
    } catch (Fileerror) {
        console.log("File Error " + Fileerror.stack);
    }
}


// location = [a:b:c:d]
// a := start line number, b : column info for start, c : end line number, d : column info for end
//TODO :; Handle cases where function could not be located
function findFun(fileName, location, startLineNumber) {
    var _fn = fileName.toString();
    var _loc = location;
    var result = null;
    var err_result;
    if (_fn.length > 0) {

        //read the whole input file
        var inputProgramFromFile = fs.readFileSync(_fn + '.js', 'utf8');
        var astForInput = esprima.parseModule(inputProgramFromFile.toString(), {range: true, loc: true, tokens: false, ecmaVersion: 6});
        estraverse.traverse(astForInput,
            {  enter: function (node, parent) { // check for function name and replace
                    if (node.type == 'FunctionDeclaration') {
                        if (startLineNumber == node.loc.start.line || (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1])))) {
                            // found the function name .
                            result = node.id.name;
                            this.break();
                        }
                    }else if (node.type === 'ExpressionStatement') { // lhs = function(){ }
                        if (node.expression.type === 'AssignmentExpression') {
                            var left = node.expression.left;
                            var right = node.expression.right;
                            if (startLineNumber === node.loc.start.line.toString() || (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1])))) {
                                if (right.type === 'FunctionExpression') {
                                    // lhs = MemberExpression rhs = FunctionExpression
                                    if (left.type === 'MemberExpression') {
                                        var leftPath = getMemberExpressionName(left);
                                        result = leftPath;
                                        this.break();

                                    }else if(left.type === 'Identifier'){// lhs = Identifier , rhs = function expression
                                        if(left.name){
                                            var functionName = left.name;
                                            result = functionName;
                                            this.break();
                                        }else{
                                            // handled in another case for anonymous
                                            throw("No name of the Identifier ");
                                        }

                                    }else{
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
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)){
                            if (node.id !== null) {// has an id
                                result = node.id.name;
                                this.break();
                            } else { // anonymous function case, create a unique-Id based on the function location
                                result = utility.cerateUniqueId(node.loc);
                                this.break();
                            }
                        }
                    }else if(node.type === 'NewExpression'){
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)){
                            err_result = node.type;
                         /*   if (node.callee.name !== null) {// has an id
                                result = node.callee.name;
                                this.break();
                            } else { // anonymous function case, create a unique-Id based on the function location
                                result = utility.cerateUniqueId(node.loc);
                                this.break();
                            }*/
                        }
                    }else if(node.type === 'ArrayExpression'){
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)) {
                            var elementsForExp = node.elements;
                         /*   elementsForExp.forEach(function(elem){
                                switch (elem.type){
                                    // Expressions
                                    case 'FunctionExpression':

                                        err_result = node.type +' with '+elem.type;
                                        break;
                                    case 'AssignmentExpression':
                                        err_result = node.type +' with '+elem.type;


                                        break;

                                    // SpreadElements
                                    case 'SpreadElement':
                                        var argument = elem.argument;
                                        // Expression
                                        err_result = node.type +' with '+elem.type;
                                        break;
                                        /!*switch (argument.type){


                                        }*!/
                                    default:
                                        err_result = node.type +' with '+elem.type;
                                        break;
                                }


                            });
*/
                            err_result = node.type;
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }


                    }else if(node.type === 'MemberExpression'){
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)) {
                            err_result = node.type;
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }
                    }else{
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)) {
                            err_result = node.type;
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }

                    }
                },

                leave: function (node, parent) {
                }

            });
        // traverse the file

    } else {
        console.log("Error : Not a javascript file " + _fn.substring(_fn.indexOf('.') + 1, _fn.length));

    }

    if (result !== null)
        return result;
    else {
        if(err_result === 'NewExpression')
            return IgnoreFunction;
        else {
            console.log("No function found for the input file and location for node.type " + err_result);
        }
    }

}

function populateGlobalModifiedFilesList(fileName_Func_Location){

    for (elem in fileName_Func_Location){
        try {
            var fileName = fileName_Func_Location[elem].fileName;
            var fileNameRelative =fileName.substring(fileName.lastIndexOf('/')+1, fileName.length);
            globalModifiedFilesList[fileNameRelative+'.js'] = fileNameRelative+ '.js';
        }catch (err){
           console.error('ModifiedList Error Case '+err);
        }
    }
    return globalModifiedFilesList;

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
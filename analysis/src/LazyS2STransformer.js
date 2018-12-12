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
const path = require('path');
const IgnoreFunction = 'IgnoreFunction';
var commons = require('../../commons.js');


// records for each fileName f, an array of function locations to be replaced by stubs
var fileName_StubListMap = {}; // {'fileName': {"reachable": TRUE/FALSE , "functionLocs":[]}
var globalModifiedFilesList = {};


var found= 0;
var notfound = 0;

var methodsLostnFound = {"lost":[], "found":[]};
var ignoreExpressions = ['NewExpression'];

const NO_CHANGES_NEEDED = 'NO-STUB';
const LOCATION_DELTA_THRESSHOLD = 2;
/*
*  A lazy version of the S2S Transformer, it replaces the original (statically determined ) set of potentially unreachable functions
*  with minimal (with logging capabilities) bodies and then runs an iterative dynamic profiling based refinement of these unreachable functions using testcases.
*  The algorithm is incremental, thus adding a new test to the set of tests requires to update the transfomrer application only incementally.
*  @param : sl : initial stublist
*  @param : input : input directory where the application is location
*  @param : out : output path where the transformed application will be written
*  @param : log : the path to the logfile to be used for the transformed application's functions
*  @param : callgraph : initial callgraph
*  @param :  fileNameStubMap : a map // {'fileName': {"reachable": TRUE/FALSE , "functionLocs":[]} used for iterative incremental transformation
*  @return : success (0) or failure (-1)
*
 */
module.exports.lazyTransformer = function (sl, input, out, log, isNode, callgraph, fileNameStubMap) {
        console.log('S2S Transformation Called');
        var stubListFile = path.resolve(sl);
        var inputAppDir = path.resolve(input);
        var outputAppDir = path.resolve(out);
        var initialCallGraph = callgraph;
        try {
            var fileMap_globalFilePair = preprocessInput(stubListFile, initialCallGraph);
            fileName_StubListMap = fileMap_globalFilePair[0];
            globalModifiedFilesList = fileMap_globalFilePair[1];
            var changes = mainTransformer(fileName_StubListMap, outputAppDir, log);
            if (changes === NO_CHANGES_NEEDED)
                generateModifiedAsOriginal(stubListFile);
            console.log('Transformation Finished');
            return fileName_StubListMap;
            //return 0;
        }catch (err){
            console.error(err.stack);
            return -1;

        }
};



/* preprocesses the input, read the stubList,
 *  populates the fineName_Func_Location
 * populates the globalModifiedFileList
 * @param: stubFile :  The json file containing the list of potentially stub-able functions
 * @param: callGraph :
 */
function preprocessInput(stubFile, callGraph){ // file -> FileName_FunctionMap -> ()
    fileName_StubListMap = populatefileStubListMap(stubFile, callGraph);
    globalModifiedFilesList = populateGlobalModifiedFilesList(fileName_StubListMap);
    return [fileName_StubListMap, globalModifiedFilesList];
}

// read the JSON file and create a fileName and function Location to be replaced by stubs
function populatefileStubListMap(outFileJSON, callGraph){
    var obj = JSON.parse(fs.readFileSync(outFileJSON, 'utf8'));
    var unexecutedFunctions = obj.unexecutedFunctions;
    var loadedFunctions = obj.loadedFunctions;

    for(var i = 0 ; i< unexecutedFunctions.length ; i++){

        var stubLoction_elem = unexecutedFunctions[i].stubLocation;
        var filePath_LineNo = stubLoction_elem.split(".js:");
        var filePath = filePath_LineNo[0];
        var locArray = filePath_LineNo[1].split(':');
        if(fileName_StubListMap.hasOwnProperty(filePath)){
            fileName_StubListMap[filePath].funcLoc.push(locArray);
        }else{
            if(isFileReachable(filePath, callGraph)) {
                fileName_StubListMap[filePath] = {"reachable":true, "funcLoc":[]};

            }else {
                fileName_StubListMap[filePath] = {"reachable":false, "funcLoc":[]};
            }
            fileName_StubListMap[filePath].funcLoc.push(locArray);
        }
    }
    //utility.printObjWithMsg(fileName_StubListMap, 'GENERATED-MAP');
    return fileName_StubListMap;
}


function isFileReachable(filePath, callGraphObject){

    var cgEdgeArray = callGraphObject.edges;
    for(var i in cgEdgeArray){
        var edge = cgEdgeArray[i];
        if(edge.target.path.toString() === filePath.toString()+'.js')
            return true;


    }

   return false;
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


function deadFileTransformer(fileName, stubLocationsArray, updatedASTList, errorFile, logfile){
    utility.printObjWithMsg(fileName, 'Transforming dead file');
    // for now we are just replacing the ast with an empty ast
    var astForInput = {};
    for (var index in stubLocationsArray) {
        var location = stubLocationsArray[index];
        var startLineNumber = parseInt(location[0]);


        if (path.resolve(fileName).toString().indexOf(path.sep + 'node_modules' + path.sep + 'mocha' + path.sep) > -1) {
            console.log("/node_modules/mocha assumption");
            continue;
        }
        if (updatedASTList.hasOwnProperty(fileName)) { // first time
            astForInput = updatedASTList[fileName];

        }else { // performed once
            var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
            astForInput = esprima.parseModule(inputProgramFromFile.toString(), {
                range: true,
                loc: true,
                tokens: true,
                ecmaVersion: 6
            });
            // set the   fileName
            astForInput.attr = {'fileName': fileName + '.js'};
            transformer.addHeaderInstructions(astForInput);
            updatedASTList[fileName] = astForInput;
        }
        var functionName = findFun(fileName, location, startLineNumber, astForInput);
        /* No functionName found , log appropriately */
        if (!functionName || functionName === null) {
            notfound++;
            //console.error("[FindFun] function Name could not be found : ");
            continue;
        } else if (functionName.error) {
            if (ignoreExpressions.includes(functionName.error)) {
                continue;
            } else {
                notfound++;
                methodsLostnFound.lost.push({
                    'location': location + '@' + fileName,
                    'error': functionName.error
                });
                // console.error("[FindFun] function Name could not be found : " + functionName.error);
                continue;
            }
        }
        /* functionName or  uniqueId found for the location */
        found++;
        methodsLostnFound.found.push({'location': location + '@' + fileName});
        var replaced = false;
        try {
            if (functionName.type === 'UniqueArrowFunctionId') {
                replaced = transformer.replaceEmptyArrowFunctionExpression(astForInput, functionName, functionName, logfile);
            } else if (functionName.type === 'ClassMethod') {
                var uniqueIdForMethodBody = utility.cerateUniqueId(functionName.loc);
                replaced = transformer.replaceEmptyClassMethod(astForInput, functionName, uniqueIdForMethodBody, logfile);
            } else if (functionName.type == utility.UNIQUE_ID_TYPE) {
                if (logfile)
                    replaced = transformer.replaceEmpty(astForInput, null, functionName, logfile);
                else
                    replaced = transformer.replaceEmpty(astForInput, null, functionName);
            } else { // general function expression and declaration
                if (logfile)
                    replaced = transformer.replaceEmpty(astForInput, functionName, null, logfile);
                else
                    replaced = transformer.replaceEmpty(astForInput, functionName, null);
            }
            if (replaced)
                updatedASTList[fileName] = astForInput;
            continue;
        } catch (e) {
            commons.logErrorToFile(e.stack, errorFile);
            throw Error(e);
        }
    }


    return astForInput;






}

/*
 * Main code transformer function
 * Runs the code transformation for each potentially stub
 */
function mainTransformer(fileName_Func_Location, pathToOutput, logfile) {
    console.log('Running Main Transformer');
    var errroFile = path.resolve(pathToOutput, 'errorlog.log');
    // if no stub generated the transformed file is similar to original and return;
    if (Object.keys(fileName_Func_Location).length === 0 && fileName_Func_Location.constructor === Object) {
        console.error("No potentially unreachable functions found by the analysis");
        return NO_CHANGES_NEEDED;
    }



    for (var elem in fileName_Func_Location) {
        var updatedASTList = {};
        var fileName = elem;
        var stubLocationsArray = fileName_Func_Location[elem].funcLoc;
        var isFileReachable = fileName_Func_Location[elem].reachable;
        var filePath = path.resolve(fileName);

        if ((filePath.toString().indexOf(path.sep + 'input' + path.sep) === -1)
            || (filePath.toString().indexOf(path.sep + 'node_modules' + path.sep + 'mocha' + path.sep) > -1)
            || (filePath.toString().indexOf(path.sep + 'debloatingJS' + path.sep) > -1)
            || (filePath.toString().indexOf(path.sep + 'node_modules' + path.sep + 'chai' + path.sep) > -1)
            || (filePath.toString().indexOf('.min') > -1)
            || (filePath.toString().indexOf('-min') > -1)) {
            //console.log("/input/ assumption :: Skipping transformation "+filePath);
            continue;
        }


        if (!isFileReachable) {
            var astForDeadFile = deadFileTransformer(fileName, stubLocationsArray, updatedASTList, errroFile, logfile);
            updatedASTList[fileName] = astForDeadFile;

        } else { // transform Alive files

            for (var index in stubLocationsArray) {

                var location = stubLocationsArray[index];
                var startLineNumber = parseInt(location[0]);

                /* Ignore the files outside the input project directory and other few packages*/

                if (path.resolve(fileName).toString().indexOf(path.sep + 'node_modules' + path.sep + 'mocha' + path.sep) > -1) {
                    console.log("/node_modules/mocha assumption");
                    continue;
                }


                var astForInput = {};
                if (updatedASTList.hasOwnProperty(fileName)) {
                    astForInput = updatedASTList[fileName];
                } else { // performed once
                    var inputProgramFromFile = fs.readFileSync(fileName + '.js', 'utf8');
                    astForInput = esprima.parseModule(inputProgramFromFile.toString(), {
                        range: true,
                        loc: true,
                        tokens: true,
                        ecmaVersion: 6
                    });
                    // set the   fileName
                    astForInput.attr = {'fileName': fileName + '.js'};
                    transformer.addCachedCodeDeclaration(astForInput);
                    transformer.addHeaderInstructions(astForInput);
                    transformer.addSrcfileDeclaration(astForInput, fileName);
                    updatedASTList[fileName] = astForInput;
                }
                var functionName = findFun(fileName, location, startLineNumber, astForInput);
                /* No functionName found , log appropriately */
                if (!functionName || functionName === null) {
                    notfound++;
                    //console.error("[FindFun] function Name could not be found : ");
                    continue;
                } else if (functionName.error) {
                    if (ignoreExpressions.includes(functionName.error)) {
                        continue;
                    } else {
                        notfound++;
                        methodsLostnFound.lost.push({
                            'location': location + '@' + fileName,
                            'error': functionName.error
                        });
                        // console.error("[FindFun] function Name could not be found : " + functionName.error);
                        continue;
                    }
                }
                /* functionName or  uniqueId found for the location */
                found++;
                methodsLostnFound.found.push({'location': location + '@' + fileName});
                var replaced = false;
                try {
                    if (functionName.type === 'UniqueArrowFunctionId') {
                        replaced = transformer.replaceArrowFunctionExpression(astForInput, functionName, functionName, logfile);
                    } else if (functionName.type === 'ClassMethod') {
                        var uniqueIdForMethodBody = utility.cerateUniqueId(functionName.loc);
                        replaced = transformer.replaceClassMethod(astForInput, functionName, uniqueIdForMethodBody, logfile);
                    } else if (functionName.type == utility.UNIQUE_ID_TYPE) {
                        if (logfile)
                            replaced = transformer.replace(astForInput, null, functionName, logfile);
                        else
                            replaced = transformer.replace(astForInput, null, functionName);
                    } else { // general function expression and declaration
                        if (logfile)
                            replaced = transformer.replace(astForInput, functionName, null, logfile);
                        else
                            replaced = transformer.replace(astForInput, functionName, null);
                    }
                    if (replaced)
                        updatedASTList[fileName] = astForInput;
                    continue;
                } catch (e) {
                    commons.logErrorToFile(e.stack, errroFile);
                    throw Error(e);
                }
            }
        }


        utility.printObjWithMsg('', 'Transformed files Calculated successfully');
        console.log("Re-writing changed files");
        try {
            mkdirp.sync(path.resolve(pathToOutput));
            // writing the modified files corresponding to the changed original file
            var numTransformedFiles = 0;
            for (fileN in updatedASTList) {
                var baseFileName = path.basename(fileN);
                var fullOriginalPath = path.resolve(fileN);

                if (fullOriginalPath.toString().indexOf(path.sep + 'input' + path.sep) === -1) {
                    console.log("Input path does not contain /input/");
                    continue;

                }
                var fullModifiedPath = path.resolve(fullOriginalPath.toString().replace('input', 'output-actual') + '.js');
                mkdirp.sync(path.dirname(fullModifiedPath));
                utility.printObjWithMsg(fullModifiedPath, 'Writing Transformed');
                fs.writeFileSync(fullModifiedPath, escodegen.generate(updatedASTList[fileN]));
                numTransformedFiles++;
            }
            fs.writeFileSync(path.resolve(pathToOutput, 'transformed.txt'), 'Total Number of Transformed Files ' + numTransformedFiles);
        } catch (errorMsg) {
            console.log("[S2STransformer :: File Error] " + errorMsg.stack);
        }
    }
}


// location = [a:b:c:d]
// a := start line number, b : column info for start, c : end line number, d : column info for end
//TODO :; Handle cases where function could not be located
function findFun(fileName, location, startLineNumber, astForInput) {
    var _fn = fileName.toString();
    var _loc = location;
    var result = null;
    var err_result;
    if (_fn.length > 0) {
        var startcol = parseInt(_loc[1]);
        var endLine = parseInt(_loc[2]);
        var endcol = parseInt(_loc[3]);
        estraverse.traverse(astForInput,
            {  enter: function (node, parent) { // check for function name and replace
                    if(!node.loc){
                        //console.error('node has no line number associated skipping this node');
                        estraverse.VisitorOption.skip;
                    }else if (node.type == 'FunctionDeclaration') {
                        if ((startLineNumber === node.loc.start.line && startcol === node.loc.start.column) || (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))) {
                            result = node.id.name;
                            this.break();
                        }
                    }else if (node.type === 'ExpressionStatement') { // lhs = function(){ }
                        if (node.expression.type === 'AssignmentExpression') {
                            var left = node.expression.left;
                            var right = node.expression.right;
                            if ((startLineNumber === node.loc.start.line && startcol === node.loc.start.column) || (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))) {
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
                                            throw Error("No name of the Identifier ");
                                        }

                                    }else{
                                        estraverse.VisitorOption.skip;
                                    }
                                }
                            }else{
                                estraverse.VisitorOption.skip;
                            }
                        } else if(node.expression.type === 'FunctionExpression'){
                            if((startLineNumber === node.loc.start.line && startcol === node.loc.start.column) || (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))){
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
                            if( (startLineNumber === node.loc.start.line && startcol === node.loc.start.column) ||
                                (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))) {
                                // node.id will always be null for an ArrowFunctionExpression
                                result = utility.createArrowFunctionName(node.loc);
                                node.attr = {"type": "ArrowFunctionExpression", "loc":node.loc};
                                this.break();

                            }else{
                                estraverse.VisitorOption.skip;
                            }
                        }else if(node.expression.type === 'CallExpression'){
                            estraverse.VisitorOption.skip;

                        }

                        else {
                            estraverse.VisitorOption.skip;
                        }
                    }else if(node.type === 'CallExpression'){
                        estraverse.VisitorOption.skip;


                    }else if(node.type === 'MethodDefinition'){ // ES6  class Var{ method1 () {}}
                        var methodKey = node.key;
                        var methodValue = node.value;
                        var methodKind = node.kind;
                        if(methodValue.type === 'FunctionExpression') {
                            if ((methodValue.loc.start.line === parseInt(_loc[0])) && (Math.abs(methodValue.loc.start.column - _loc[1]) <= LOCATION_DELTA_THRESSHOLD)) {
                                switch (methodKey.type) {
                                    case 'Identifier':
                                        var methodName = methodKey.name;
                                        var enclosingClass = getEnclosingClassDefinitionNode(astForInput,parent);

                                        if(enclosingClass !== null)
                                            result = utility.createClassMethodName(methodName, methodKind, methodValue.loc, enclosingClass.superClass);
                                        else
                                            throw Error('[findFun ] cannot locate the enclosing class for the methodDefinition '+methodKey);

                                        methodValue.attr = {"type": 'ClassMethod', "methodName": methodName, "loc":methodValue.loc, "kind":methodKind, "superClass":enclosingClass.superClass};
                                        this.break();
                                        break;
                                    default:
                                        throw Error('Unhandled Method Definition type ' + methodKey.type);
                                }
                            }
                        }else
                            estraverse.VisitorOption.skip;
                    }else if(node.type === 'FunctionExpression') {
                        //compare the location
                        if( (node.loc.start.line === parseInt(_loc[0])) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)){
                            if (node.id !== null) {// has an id
                                result = node.id.name;
                                node.attr = {"type": "FunctionExpression"};
                                this.break();
                            } else { // anonymous function case, create a unique-Id based on the function location
                                result = utility.cerateUniqueId(node.loc);
                                node.attr = {"type": "AnonymousFunctionExpression", "loc":node.loc};
                                this.break();
                            }
                        }else
                            estraverse.VisitorOption.skip;

                    }else if(node.type === 'NewExpression'){
                        if( node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)){
                            err_result = node.type;
                            this.break();
                            /*   if (node.callee.name !== null) {// has an id
                                   result = node.callee.name;
                                   this.break();
                               } else { // anonymous function case, create a unique-Id based on the function location
                                   result = utility.cerateUniqueId(node.loc);
                                   this.break();
                               }*/
                        }else
                            estraverse.VisitorOption.skip;

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
                        if ((startLineNumber === node.loc.start.line && startcol === node.loc.start.column) ||
                            (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))){
                            err_result = node.type;
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }
                    }else if(node.type === 'ArrowFunctionExpression'){
                        if( (startLineNumber === node.loc.start.line && startcol === node.loc.start.column) ||
                            (node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD))) {
                            // node.id will always be null for an ArrowFunctionExpression
                            result = utility.createArrowFunctionName(node.loc);
                            node.attr = {"type": "ArrowFunctionExpression", "loc":node.loc};
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }
                    }

                    else{
                        if( ((startLineNumber === node.loc.start.line && startcol === node.loc.start.column) && (endLine === node.loc.end.line && endcol === node.loc.end.column)) ||
                            ((node.loc.start.line === parseInt(_loc[0]) && (Math.abs(node.loc.start.column -_loc[1]) <= LOCATION_DELTA_THRESSHOLD)) && (endLine === node.loc.end.line && endcol === node.loc.end.column))) {
                            err_result = node.type;
                            this.break();

                        }else{
                            estraverse.VisitorOption.skip;
                        }

                    }
                },

                leave: function (node, parent) {
                    estraverse.VisitorOption.skip;

                }

            });
        // traverse the file

    } else {
        console.log("Error : Not a javascript file " + _fn.substring(_fn.indexOf('.') + 1, _fn.length));

    }

    if (result !== null)
        return result;
    else {
        if(err_result){
            //return err_result;
            return {'error': err_result};
            //console.log("No function found for the input file and location for node.type " + err_result);
        }else{
            return null;
            //console.log("No function found for the input file and location for node.type " + err_result);
        }
    }

}

function getEnclosingClassDefinitionNode(ast, parentNode) {
    if(!parentNode || parentNode === null)
        return null;
    var classDec = null;
    if (parentNode.type === 'ClassDeclaration')
        return parentNode;
    else{
        estraverse.traverse(ast,
            { enter : function (node, parent) {
                    if(node === parentNode){
                        classDec = getEnclosingClassDefinitionNode(ast, parent);
                        this.break();
                    }else
                        estraverse.VisitorOption.skip;

                },


                leave : function (node, parent) {
                    estraverse.VisitorOption.skip;

                }

            });

    }
    return classDec;
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

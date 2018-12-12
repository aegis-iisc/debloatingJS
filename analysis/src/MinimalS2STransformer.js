
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

var fileNamesList = [];
var globalModifiedFileList = [];



module.exports.minimalTransformer = function (sl, input, out, log) {
    console.log(' Minimal Transformation Called');
    var stubListFile = path.resolve(sl);
    var inputAppDir = path.resolve(input);
    var outputAppDir = path.resolve(out);

    try { // simply change the preprocessing Input to get the list of all the files in the application
        var fileNamesList = preprocessAllLoaded(stubListFile);
        var changes = mainTransformer(fileNamesList, outputAppDir, log);
        console.log('Transformation Finished');
        return fileNamesList;
        //return 0;
    }catch (err){
        console.error(err.stack);
        return -1;

    }
};
/*
 * processes the stubList.json file and returns list of all the files to be replaced with stubs.
 * @param : stubFile : the stubList file passed to the minimalTransfomrer as a parameter
 * @return a Pair of <fileNames to be stubbed, list of fileNames which are being modified>
 */
function preprocessAllLoaded(stubFile){
    var fileList = populateFileNameList(stubFile);
    return fileList;
}


function populateFileNameList(outFileJSON) {
// read the JSON file and create a fileName and function Location to be replaced by stubs
    var obj = JSON.parse(fs.readFileSync(outFileJSON, 'utf8'));
    var unexecutedFunctions = obj.unexecutedFunctions;
    var loadedFunctions = obj.loadedFunctions;
    var filePathList = [];

    for (var i = 0; i < loadedFunctions.length; i++) {
        var loadedLocation = loadedFunctions[i].loadingLocation;
        var filePath_LineNumber = loadedLocation.split('.js:');
        var filePath = filePath_LineNumber[0];
        var locArray = filePath_LineNumber[1].split(':');
        filePathList.push(filePath);
    }
    utils.printObjWithMsg(filePathList, 'filePath');
    return filePathList;
}

/*
 * Main code transformer function
 * Runs the code transformation for each potentially stub
 */
function mainTransformer(fileNamesList, pathToOutput, logfile) {
    console.log('Running Main Transformer');
    var errorFile = path.resolve(pathToOutput, 'errorlog.log');
    for (var elem in fileNamesList) {
        var updatedASTList = {};
        var fileName = fileNamesList[elem];
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
            transformer.addHeaderInstructions(astForInput);
            transformer.addSrcfileDeclaration(astForInput, fileName);
            updatedASTList[fileName] = astForInput;
        }

        var listExports = findExportStatements(astForInput);
        listExports.forEach(function(stmt){
           var replaced = false;
           try {
               replaced = transformer.replaceExportStatement(astForInput, stmt, logfile);
               if(replaced)
                   updatedASTList[fileName] = astForInput;
               return;

           }  catch (e) {
               commons.logErrorToFile(e.stack, errroFile);
               throw Error(e);
           }
        });

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
            console.log("[MinimalS2STransformer :: File Error] " + errorMsg.stack);
        }
    }
}


function findExportStatements(ast){
    var exportsNodes = [];
    estraverse.traverse(ast, {
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
                            if (memberExpressionName.toString().indexOf('module.exports') > -1) {//} || lhs.toString().indexOf('exports.')){
                                exportsNodes.push(node);
                            } else if (memberExpressionName.toString().indexOf('exports.') > -1) {//} || lhs.toString().indexOf('exports.')){
                                exportsNodes.push(node);
                            }
                        }

                        break;
                    default :
                        estraverse.VisitorOption.skip;
                        break;


                }

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




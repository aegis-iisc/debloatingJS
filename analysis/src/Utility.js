//utility functions, move it to a new module for such utilities.
var exports = module.exports = {};
var fs = require('fs');
var shelljs = require('shelljs');
var path = require('path');

function printObject (obj){
    for (var id in obj){
        if (obj.hasOwnProperty(id)){
            if(typeof obj[id] === 'object')
                console.log( id +" : " +exports.printObject(obj[id]));
            else
                console.log( id +" : " +obj[id].toString());
        }
    }
}

function compareLoc (loc1, loc2){
    try {
        if (loc1.start.line === loc2.startline && loc1.start.column === loc2.startcol) {
            return true;
        } else {
            return false;
        }
    }catch (error){
        console.error('[compareLoc ]'+error);
    }

}

function createArrowFunctionName(locFrom){
    return {"type": 'UniqueArrowFunctionId', "startline" : locFrom.start.line, "startcol":locFrom.start.column};
}

/*
    function to create unique Id from a loc
 */
function cerateUniqueId (locFrom){
    return {"type": 'UniqueFunctionId', "startline" : locFrom.start.line, "startcol":locFrom.start.column};
}

function createClassMethodName(methodName, kind, methodLoc, superClass){

    return {"type": 'ClassMethod', "name":methodName, "kind": kind, "loc":methodLoc, "superClass":superClass};
}

function getReletivePath (absolutePath) {
    absolutePath = absolutePath.substring(1, absolutePath.length - 1);
    var relativePath = path.relative(process.cwd(), absolutePath);
    return relativePath;
}


function printObjWithMsg(obj, msg){
    console.log(msg);
    console.log(obj);
}

module.exports = {
    cerateUniqueId: cerateUniqueId,
    compareLoc: compareLoc,
    printObject: printObject,
    UNIQUE_ID_TYPE: 'UniqueFunctionId',
    getReletivePath: getReletivePath,
    printObjWithMsg : printObjWithMsg,
    createClassMethodName : createClassMethodName,
    createArrowFunctionName:createArrowFunctionName
};

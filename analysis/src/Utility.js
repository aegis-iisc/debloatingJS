//utility functions, move it to a new module for such utilities.
var exports = module.exports = {};
var fs = require('fs');
var shelljs = require('shelljs');
exports.printObject = function(obj){

    for (var id in obj){
        if (obj.hasOwnProperty(id)){
            if(typeof obj[id] === 'object')
                console.log( id +" : " +exports.printObject(obj[id]));
            else
                console.log( id +" : " +obj[id].toString());
        }
    }
}

function createExpectedOutputFile (fileName){

    var loadedFunctions = {};
    var invokedFunctions = {};
    var stubList = {};
    var jsonPath = fileName+'.json';
    var jsonObject = {'loadedfunctions': loadedFunctions, 'invokedfunctions': invokedFunctions, 'stubList': stubList};
    fs.writeFileSync(jsonPath, JSON.stringify(jsonObject));
    if(!fs.existsSync(fileName+'_persistent.json')){
        var code =shelljs.exec('cp '+jsonPath+' '+fileName+'_persistent.json').code;
        return 0;
    }else
        return 0;

}

exports.createExpectedOutputFile = createExpectedOutputFile;


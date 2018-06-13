//utility functions, move it to a new module for such utilities.
var exports = module.exports = {};

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

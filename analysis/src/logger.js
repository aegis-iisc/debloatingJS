
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');



/*
 * A timestamp function, this can be extended to record more details, keeping minimal currently
 */
var logTimeStamp = function(){
    return Date.now();
};

module.exports.logStubInfo = function(funcName, logfile){

  var line = 'Expanded stub '+funcName+ ' @ ' + logTimeStamp() + '\n';
  //fs.appendFileSync(logfile, line);
};
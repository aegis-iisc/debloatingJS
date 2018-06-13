
const line = require("./line-test2.js");
var exports = module.exports = {};
const math = Math;

exports.area = function (radius) {
    line.drawLine(radius);
    return math.PI * radius * radius;

};
function unused_function(){

    console.log("Unused Function");

}

exports.unused_function = unused_function;


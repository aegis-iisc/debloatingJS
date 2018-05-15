/* A circle class with eported functions, We wish to see how much of these code is actually loaded in the application */

var exports = module.exports = {};


const math = Math;
var unused_diameter = 2;
exports.area = function (radius) {

	return math.PI * radius * radius;

};
function unused_function(){

	console.log("Unused Function");

}
exports.perimeter = function (radius)  {

	return 2 * math.PI * radius;
};

exports.diameter = function (radius) {
	var unused_dimeter = 2;
	return 2 * unused_dimeter;
};

exports.isNontrivial = function (radius){

	if (radius >= 0)
		return true;
	else 
		return false;

};

const line = require('./line.js');
var exports = module.exports = {};
const math = Math;
var unused_diameter = 2;
exports.area = function (radius) {
    return math.PI * radius * radius;
};
function unused_function() {
    console.log('Unused Function');
}
exports.perimeter = function (radius) {
    return 2 * math.PI * radius;
};
exports.drawCircle = function (radius) {
    if (this.isNontrivial(radius)) {
        l = line.drawLine(exports.perimeter(radius));
        line.trim();
    }
};
exports.diameter = function (radius) {
    var _var1;
        if (original_exports.diameter == null) {
        lazyLoad(exports.diameter);
        original_exports.diameter = this.eval(cachedCode[exports.diameter]);
        exports.diameter = original_exports.diameter;
    }
        original_exports.diameter.apply(this, radius);
};
exports.isNontrivial = function (radius) {
    if (radius >= 0)
        return true;
    else
        return false;
};
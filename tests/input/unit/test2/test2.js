var circle = require('./circle-test2.js');
var line = require('./line-test2.js');
var https = require('https');
var point = require('./test2-innerdir/point-test2.js');


var area = circle.area(2);
console.log("Area of the circle "+area);
point.drawPoint(3, 4);

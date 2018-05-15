	/* Comments */

var circle = require('./exported_circle_second.js');
var https = require('https');
radius = 2;
area = circle.area(radius);
perimeter = circle.perimeter(radius);
isNT = circle.isNontrivial(radius)

console.log("The circle with radius "+radius + " has Area "+area + " and Perimeter "+perimeter);
//const url = "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";

//console.log("HTTPS "+https.toString());

Circle = {radius, area, perimeter};


function makeACircle (radius){

	Circle[radius] = radius;
	Circle[area] = circle.area ( this.radius);
	Circle[perimeter] = circle.perimeter(this.radius);
	
	
	
}


makeACircle(radius);

circle.drawCircle(Circle[radius]);






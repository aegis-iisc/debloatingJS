var exports = module.exports = {};


exports.point = function (x , y){

	console.log("a point (x,y)");

};


exports.drawPoint = function (x, y){

	var origin_x = 0;
	var origin_y = 0;

	for( var i = 0; i < x ; i++){
		console.log("\n");
		for (var j = 0; j < y ; j++){
			console.log("\t");
			j = j+1;
		}
		
		i = i + 1;
	}
	console.log(".");	

}; 


exports.drawPoint(3,4);

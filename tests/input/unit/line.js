var exports = module.exports = {};

var exports = module.exports ={};

exports.line = { line_size : 0};
exports.drawLine = function (size){
	
	if(size > 0){

		for (i = 0 ; i < size ; i += 1){
			process.stdout.write("-");
		}
		return size;
	}else {

		return size;
	}


};


exports.trim = function (){
	
   if (this.line.size > 0){
	this.lize.size = this.line.size - 1;
	
	}

};


exports.extraCheks = function(){



};



var printTypes = ([1, 2, 3]).filter(function(item) {  
  	console.log(typeof item);
	return typeof item === 'number';
});

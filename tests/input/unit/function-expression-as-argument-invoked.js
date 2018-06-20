/*
* function(item) defined is executed for each item in the list. 
 TODO How to handle such a case.
*/

var printTypes = ([1, 2, 3]).filter(function(item) {  
  	console.log(typeof item);
	return typeof item === 'number';
});

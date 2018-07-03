/*
* function(item) defined is executed for each item in the list. 
 TODO How to handle such a case.
*/

var printTypes = ([1, 2, 3]).filter(function(item) {  
  	console.log(typeof item);
	return typeof item === 'number';
});


/*
Expected modified function
var original_unnamedFunc_uid = null;
function unnamedFunc_uid(item){
if(original_unnamedFunc_uid == null){
	lazyLoad(unnamedFunction_uid);
	var loadedBody = loadAndInvoke('unnamedFunc_uid', srcFile)
	eval('original_unnamedFunc_uid = '+loadedBody  );
	unnamedFunc_uid = original_unnamedFunc_uid;
}
	original_unnamedFuncuid_uid.apply(this);

}


var printTypes = ([1,2,3]).filter(original_unnamedFunc_uid(item));


*/

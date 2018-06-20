var exports = module.exports = {};
function hello(){
	console.log("hello from bar");

}

function helloUnused(){
	console.log('Unused hello from bar');
}
exports.hello = hello;
exports.helloUnused = helloUnused;

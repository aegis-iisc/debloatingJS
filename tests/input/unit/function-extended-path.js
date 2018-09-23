'use strict';


/**
 * Expose `Test`.
 */

module.exports = Test;

function Test (title) {
	console.log("test "+title);

}



Test.prototype.clone = function () {
  var test = new Test(this.title);
  console.log("Test.prototype.clone");
  return test;
};

Test("Test Function");

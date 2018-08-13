var assert = require('assert');
var sampeApp = require('../sample-app');

describe('function qux', function() {
	it('should print qux', function(){
		assert.equal(sampeApp.qux(), 3);
	})

});

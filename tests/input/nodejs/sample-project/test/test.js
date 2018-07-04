var assert = require('assert');
var sampeApp = require('../sample-app');

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('variable x', function () {
    it('should be 1', function () {
        assert.equal(sampeApp.x, 1);
    });
});

describe('function baz', function () {
    it('should return 2', function () {
        assert.equal(sampeApp.baz(), 2);
    });
});
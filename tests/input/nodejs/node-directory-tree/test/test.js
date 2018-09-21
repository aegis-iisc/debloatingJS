// 'use strict';

var expect = require('chai').expect;
var dirtree = require('../lib/directory-tree');
var testTree = require('./fixture.js');
var excludeTree = require('./fixtureExclude.js');
var excludeTree2 = require('./fixtureMultipleExclude.js');
var PATH = require('path');

describe('directoryTree', function () {

    it('should return an Object', function () {
        var tree = dirtree('./test/test_data', { extensions: /\.txt$/ });
        expect(tree).to.be.an('object');
    });

    it('should list the children in a directory', function () {
        var tree = dirtree('./test/test_data', { extensions: /\.txt$/ });

        // 4 including the empty `some_dir_2`.
        expect(tree.children.length).to.equal(4);
    });

    it('should execute a callback function for each file with no specified extensions', function () {
        var number_of_files = 7;
        var callback_executed_times = 0;

        var tree = dirtree('./test/test_data', null, function (item, PATH) {
            callback_executed_times++;
        });

        expect(callback_executed_times).to.equal(number_of_files);
    });

    it('should execute a callback function for each file with specified extensions', function () {
        var number_of_files = 6;
        var callback_executed_times = 0;

        var tree = dirtree('./test/test_data', { extensions: /\.txt$/ }, function (item, PATH) {
            callback_executed_times++;
        });
        expect(callback_executed_times).to.equal(number_of_files);
    });

    it('should display the size of a directory (summing up the children)', function () {
        var tree = dirtree('./test/test_data', { extensions: /\.txt$/ });
        expect(tree.size).to.be.above(11000);
    });

    it('should not crash with directories where the user does not have necessary permissions', function () {
        var tree = dirtree('/root/', { extensions: /\.txt$/ });
        expect(tree).to.equal(null);
    });

    it('should return the correct exact result', function () {
        var tree = dirtree('./test/test_data', { normalizePath: true });

        replaceAbsolutePaths(tree); // todo

        expect(tree).to.deep.equal(testTree);
    });

    it('should not swallow exceptions thrown in the callback function', function () {
        var error = new Error('Something happened!');
        var badFunction = function badFunction() {
            dirtree('./test/test_data', { extensions: /\.txt$/ }, function (item) {
                throw error;
            });
        };
        expect(badFunction).to.throw(error);
    });

    it('should exclude the correct folders', function () {
        var tree = dirtree('./test/test_data', { exclude: /another_dir/, normalizePath: true });

        replaceAbsolutePaths(tree); // todo

        expect(tree).to.deep.equal(excludeTree);
    });

    it('should exclude multiple folders', function () {
        var tree = dirtree('./test/test_data', { exclude: [/another_dir/, /some_dir_2/], normalizePath: true });

        replaceAbsolutePaths(tree); // todo

        expect(tree).to.deep.equal(excludeTree2);
    });
});

// todo added this to make path formats compatible when tests are run by jalangi
function replaceAbsolutePaths (tree) {
    tree.path = replacePath(tree.path);
    if (typeof tree.children === 'undefined') return;

    for (var i = 0; i < tree.children.length; i ++) {
        replaceAbsolutePaths(tree.children[i]);
    }
}

function replacePath (path) {
    return path.substring(path.indexOf('node-directory-tree/') + 20);
}
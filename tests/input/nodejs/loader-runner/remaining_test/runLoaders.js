require("should");
var path = require("path");
var runLoaders = require("../").runLoaders;
var getContext = require("../").getContext;

var fixtures = path.resolve(__dirname, "fixtures");

describe("runLoaders", function() {
    /************* Divide Tests Here *******************/
    it("should have to correct keys in context without resource", function(done) {
        runLoaders({
            loaders: [
                path.resolve(fixtures, "identity-loader.js"),
                path.resolve(fixtures, "keys-loader.js"),
            ]
        }, function(err, result) {
            if(err) return done(err);
            try {
                JSON.parse(result.result[0]).should.be.eql({
                    context: null,
                    loaderIndex: 1,
                    query: "",
                    currentRequest: path.resolve(fixtures, "keys-loader.js") + "!",
                    remainingRequest: "",
                    previousRequest: path.resolve(fixtures, "identity-loader.js"),
                    request: path.resolve(fixtures, "identity-loader.js") + "!" +
                    path.resolve(fixtures, "keys-loader.js") + "!",
                    data: null,
                    loaders: [{
                        request: path.resolve(fixtures, "identity-loader.js"),
                        path: path.resolve(fixtures, "identity-loader.js"),
                        query: "",
                        data: {
                            identity: true
                        },
                        pitchExecuted: true,
                        normalExecuted: false
                    }, {
                        request: path.resolve(fixtures, "keys-loader.js"),
                        path: path.resolve(fixtures, "keys-loader.js"),
                        query: "",
                        data: null,
                        pitchExecuted: true,
                        normalExecuted: true
                    }]
                });
            } catch(e) {
                return done(e);
            }
            done();
        });
    });
    it("should have to correct keys in context with only resource query", function(done) {
        runLoaders({
            resource: "?query",
            loaders: [{
                loader: path.resolve(fixtures, "keys-loader.js"),
                options: {
                    ok: true
                },
                ident: "my-ident"
            }]
        }, function(err, result) {
            if(err) return done(err);
            try {
                JSON.parse(result.result[0]).should.be.eql({
                    context: null,
                    resource: "?query",
                    resourcePath: "",
                    resourceQuery: "?query",
                    loaderIndex: 0,
                    query: {
                        ok: true
                    },
                    currentRequest: path.resolve(fixtures, "keys-loader.js") + "??my-ident!?query",
                    remainingRequest: "?query",
                    previousRequest: "",
                    request: path.resolve(fixtures, "keys-loader.js") + "??my-ident!" +
                    "?query",
                    data: null,
                    loaders: [{
                        request: path.resolve(fixtures, "keys-loader.js") + "??my-ident",
                        path: path.resolve(fixtures, "keys-loader.js"),
                        query: "??my-ident",
                        ident: "my-ident",
                        options: {
                            ok: true
                        },
                        data: null,
                        pitchExecuted: true,
                        normalExecuted: true
                    }]
                });
            } catch(e) {
                return done(e);
            }
            done();
        });
    });
    it("should allow to change loader order and execution", function(done) {
        runLoaders({
            resource: path.resolve(fixtures, "bom.bin"),
            loaders: [
                path.resolve(fixtures, "change-stuff-loader.js"),
                path.resolve(fixtures, "simple-loader.js"),
                path.resolve(fixtures, "simple-loader.js")
            ]
        }, function(err, result) {
            if(err) return done(err);
            result.result.should.be.eql([
                "resource"
            ]);
            done();
        });
    });
    it("should return dependencies even if resource is missing", function(done) {
        runLoaders({
            resource: path.resolve(fixtures, "missing.txt"),
            loaders: [
                path.resolve(fixtures, "pitch-dependencies-loader.js")
            ]
        }, function(err, result) {
            err.should.be.instanceOf(Error);
            err.message.should.match(/ENOENT/i);
            result.fileDependencies.should.be.eql([
                "remainingRequest:" + path.resolve(fixtures, "missing.txt"),
                path.resolve(fixtures, "missing.txt")
            ]);
            done();
        });
    });
    it("should return dependencies even if loader is failing", function(done) {
        runLoaders({
            resource: path.resolve(fixtures, "resource.bin"),
            loaders: [
                path.resolve(fixtures, "failing-loader.js")
            ]
        }, function(err, result) {
            err.should.be.instanceOf(Error);
            err.message.should.match(/^resource$/i);
            result.fileDependencies.should.be.eql([
                path.resolve(fixtures, "resource.bin")
            ]);
            done();
        });
    });
    it("should use an ident if passed", function(done) {
        runLoaders({
            resource: path.resolve(fixtures, "resource.bin"),
            loaders: [{
                loader: path.resolve(fixtures, "pitching-loader.js")
            }, {
                loader: path.resolve(fixtures, "simple-loader.js"),
                options: {
                    f: function() {}
                },
                ident: "my-ident"
            }]
        }, function(err, result) {
            if(err) return done(err);
            result.result.should.be.eql([
                path.resolve(fixtures, "simple-loader.js") + "??my-ident!" + path.resolve(fixtures, "resource.bin") + ":"
            ]);
            done();
        });
    });
    it("should load a loader using System.import and process", function(done) {
        global.System = {
            import: function(moduleId) {
                return Promise.resolve(require(moduleId));
            }
        };
        runLoaders({
            resource: path.resolve(fixtures, "resource.bin"),
            loaders: [
                path.resolve(fixtures, "simple-loader.js")
            ]
        }, function(err, result) {
            if(err) return done(err);
            result.result.should.be.eql(["resource-simple"]);
            result.cacheable.should.be.eql(true);
            result.fileDependencies.should.be.eql([
                path.resolve(fixtures, "resource.bin")
            ]);
            result.contextDependencies.should.be.eql([]);
            done();
        });
        delete global.System;
    });
    describe("getContext", function() {
        var TESTS = [
            ["/", "/"],
            ["/path/file.js", "/path"],
            ["/some/longer/path/file.js", "/some/longer/path"],
            ["/file.js", "/"],
            ["C:\\", "C:\\"],
            ["C:\\file.js", "C:\\"],
            ["C:\\some\\path\\file.js", "C:\\some\\path"],
            ["C:\\path\\file.js", "C:\\path"],
        ];
        TESTS.forEach(function(testCase) {
            it("should get the context of '" + testCase[0] + "'", function() {
                getContext(testCase[0]).should.be.eql(testCase[1]);
            });
        });
    });
});

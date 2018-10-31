/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MemoryFileSystem = function () {
    function MemoryFileSystem(data) {
        _classCallCheck(this, MemoryFileSystem);

        this.data = data || {};
        this.join = join;
        this.pathToArray = pathToArray;
        this.normalize = normalize;
    }

    _createClass(MemoryFileSystem, [{
        key: "meta",
        value: function meta(_path) {
            var path = pathToArray(_path);
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) return;
                current = current[path[i]];
            }
            return current[path[i]];
        }
    }, {
        key: "existsSync",
        value: function existsSync(_path) {
            return !!this.meta(_path);
        }
    }, {
        key: "statSync",
        value: function statSync(_path) {
            var current = this.meta(_path);
            if (_path === "/" || isDir(current)) {
                return {
                    isFile: falseFn,
                    isDirectory: trueFn,
                    isBlockDevice: falseFn,
                    isCharacterDevice: falseFn,
                    isSymbolicLink: falseFn,
                    isFIFO: falseFn,
                    isSocket: falseFn
                };
            } else if (isFile(current)) {
                return {
                    isFile: trueFn,
                    isDirectory: falseFn,
                    isBlockDevice: falseFn,
                    isCharacterDevice: falseFn,
                    isSymbolicLink: falseFn,
                    isFIFO: falseFn,
                    isSocket: falseFn
                };
            } else {
                throw new MemoryFileSystemError(errors.code.ENOENT, _path, "stat");
            }
        }
    }, {
        key: "readFileSync",
        value: function readFileSync(_path, optionsOrEncoding) {
            var path = pathToArray(_path);
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, "readFile");
                current = current[path[i]];
            }
            if (!isFile(current[path[i]])) {
                if (isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.EISDIR, _path, "readFile");else throw new MemoryFileSystemError(errors.code.ENOENT, _path, "readFile");
            }
            current = current[path[i]];
            var encoding = (typeof optionsOrEncoding === "undefined" ? "undefined" : _typeof(optionsOrEncoding)) === "object" ? optionsOrEncoding.encoding : optionsOrEncoding;
            return encoding ? current.toString(encoding) : current;
        }
    }, {
        key: "readdirSync",
        value: function readdirSync(_path) {
            if (_path === "/") return Object.keys(this.data).filter(Boolean);
            var path = pathToArray(_path);
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, "readdir");
                current = current[path[i]];
            }
            if (!isDir(current[path[i]])) {
                if (isFile(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOTDIR, _path, "readdir");else throw new MemoryFileSystemError(errors.code.ENOENT, _path, "readdir");
            }
            return Object.keys(current[path[i]]).filter(Boolean);
        }
    }, {
        key: "mkdirpSync",
        value: function mkdirpSync(_path) {
            var path = pathToArray(_path);
            if (path.length === 0) return;
            var current = this.data;
            for (var i = 0; i < path.length; i++) {
                if (isFile(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOTDIR, _path, "mkdirp");else if (!isDir(current[path[i]])) current[path[i]] = { "": true };
                current = current[path[i]];
            }
            return;
        }
    }, {
        key: "mkdirSync",
        value: function mkdirSync(_path) {
            var path = pathToArray(_path);
            if (path.length === 0) return;
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, "mkdir");
                current = current[path[i]];
            }
            if (isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.EEXIST, _path, "mkdir");else if (isFile(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOTDIR, _path, "mkdir");
            current[path[i]] = { "": true };
            return;
        }
    }, {
        key: "_remove",
        value: function _remove(_path, name, testFn) {
            var path = pathToArray(_path);
            var operation = name === "File" ? "unlink" : "rmdir";
            if (path.length === 0) {
                throw new MemoryFileSystemError(errors.code.EPERM, _path, operation);
            }
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, operation);
                current = current[path[i]];
            }
            if (!testFn(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, operation);
            delete current[path[i]];
            return;
        }
    }, {
        key: "rmdirSync",
        value: function rmdirSync(_path) {
            return this._remove(_path, "Directory", isDir);
        }
    }, {
        key: "unlinkSync",
        value: function unlinkSync(_path) {
            return this._remove(_path, "File", isFile);
        }
    }, {
        key: "readlinkSync",
        value: function readlinkSync(_path) {
            throw new MemoryFileSystemError(errors.code.ENOSYS, _path, "readlink");
        }
    }, {
        key: "writeFileSync",
        value: function writeFileSync(_path, content, optionsOrEncoding) {
            if (!content && !optionsOrEncoding) throw new Error("No content");
            var path = pathToArray(_path);
            if (path.length === 0) {
                throw new MemoryFileSystemError(errors.code.EISDIR, _path, "writeFile");
            }
            var current = this.data;
            var i = 0;
            for (; i < path.length - 1; i++) {
                if (!isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.ENOENT, _path, "writeFile");
                current = current[path[i]];
            }
            if (isDir(current[path[i]])) throw new MemoryFileSystemError(errors.code.EISDIR, _path, "writeFile");
            var encoding = (typeof optionsOrEncoding === "undefined" ? "undefined" : _typeof(optionsOrEncoding)) === "object" ? optionsOrEncoding.encoding : optionsOrEncoding;
            current[path[i]] = optionsOrEncoding || typeof content === "string" ? new Buffer(content, encoding) : content;
            return;
        }

        // stream methods

    }, {
        key: "createReadStream",
        value: function createReadStream(path, options) {
            var stream = new ReadableStream();
            var done = false;
            var data = void 0;
            try {
                data = this.readFileSync(path);
            } catch (e) {
                stream._read = function () {
                    if (done) {
                        return;
                    }
                    done = true;
                    this.emit('error', e);
                    this.push(null);
                };
                return stream;
            }
            options = options || {};
            options.start = options.start || 0;
            options.end = options.end || data.length;
            stream._read = function () {
                if (done) {
                    return;
                }
                done = true;
                this.push(data.slice(options.start, options.end));
                this.push(null);
            };
            return stream;
        }
    }, {
        key: "createWriteStream",
        value: function createWriteStream(path) {
            var _this = this;

            var stream = new WritableStream();
            try {
                // Zero the file and make sure it is writable
                this.writeFileSync(path, new Buffer(0));
            } catch (e) {
                // This or setImmediate?
                stream.once('prefinish', function () {
                    stream.emit('error', e);
                });
                return stream;
            }
            var bl = [],
                len = 0;
            stream._write = function (chunk, encoding, callback) {
                bl.push(chunk);
                len += chunk.length;
                _this.writeFile(path, Buffer.concat(bl, len), callback);
            };
            return stream;
        }

        // async functions

    }, {
        key: "exists",
        value: function exists(path, callback) {
            return callback(this.existsSync(path));
        }
    }, {
        key: "writeFile",
        value: function writeFile(path, content, encoding, callback) {
            if (!callback) {
                callback = encoding;
                encoding = undefined;
            }
            try {
                this.writeFileSync(path, content, encoding);
            } catch (e) {
                return callback(e);
            }
            return callback();
        }
    }]);

    return MemoryFileSystem;
}();

// async functions

["stat", "readdir", "mkdirp", "rmdir", "unlink", "readlink"].forEach(function (fn) {
    MemoryFileSystem.prototype[fn] = function (path, callback) {
        var result = void 0;
        try {
            result = this[fn + "Sync"](path);
        } catch (e) {
            setImmediate(function () {
                callback(e);
            });

            return;
        }
        setImmediate(function () {
            callback(null, result);
        });
    };
});

["mkdir", "readFile"].forEach(function (fn) {
    MemoryFileSystem.prototype[fn] = function (path, optArg, callback) {
        if (!callback) {
            callback = optArg;
            optArg = undefined;
        }
        var result = void 0;
        try {
            result = this[fn + "Sync"](path, optArg);
        } catch (e) {
            setImmediate(function () {
                callback(e);
            });

            return;
        }
        setImmediate(function () {
            callback(null, result);
        });
    };
});

module.exports = MemoryFileSystem;
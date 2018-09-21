// 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var FS = require('fs');
var PATH = require('path');
var constants = {
    DIRECTORY: 'directory',
    FILE: 'file'
};

function safeReadDirSync(path) {
    var dirData = {};
    try {
        dirData = FS.readdirSync(path);
    } catch (ex) {
        if (ex.code == "EACCES")
        //User does not have permissions, ignore directory
            return null;else throw ex;
    }
    return dirData;
}

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
    return path.replace(/\\/g, '/');
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
    return (typeof regExp === 'undefined' ? 'undefined' : _typeof(regExp)) === "object" && regExp.constructor == RegExp;
}

function directoryTree(path, options, onEachFile) {
    path = PATH.resolve(__dirname, '..', path); // TODO added this for compatibility debloatingJS

    var name = PATH.basename(path);

    path = options && options.normalizePath ? normalizePath(path) : path;
    var item = { path: path, name: name };
    var stats = void 0;

    try {
        stats = FS.statSync(path);
    } catch (e) {
        return null;
    }

    // Skip if it matches the exclude regex
    if (options && options.exclude) {
        var excludes = isRegExp(options.exclude) ? [options.exclude] : options.exclude;
        if (excludes.some(function (exclusion) {
                return exclusion.test(path);
            })) {
            return null;
        }
    }

    if (stats.isFile()) {

        var ext = PATH.extname(path).toLowerCase();

        // Skip if it does not match the extension regex
        if (options && options.extensions && !options.extensions.test(ext)) {
            return null;
        }

        item.size = stats.size; // File size in bytes
        item.extension = ext;
        item.type = constants.FILE;
        if (onEachFile) {
            onEachFile(item, PATH);
        }
    } else if (stats.isDirectory()) {
        var dirData = safeReadDirSync(path);
        if (dirData === null) {
            return null;
        }

        item.children = dirData.map(function (child) {
            return directoryTree(PATH.join(path, child), options, onEachFile);
        }).filter(function (e) {
            return !!e;
        });
        item.size = item.children.reduce(function (prev, cur) {
            return prev + cur.size;
        }, 0);
        item.type = constants.DIRECTORY;
    } else {
        return null; // Or set item.size = 0 for devices, FIFO and sockets ?
    }

    return item;
}

module.exports = directoryTree;
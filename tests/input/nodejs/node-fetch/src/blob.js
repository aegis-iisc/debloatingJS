// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
// (MIT licensed)

var BUFFER = exports.BUFFER = Symbol('buffer');
var TYPE = Symbol('type');

var Blob = function () {
    function Blob() {
        _classCallCheck(this, Blob);

        this[TYPE] = '';

        var blobParts = arguments[0];
        var options = arguments[1];

        var buffers = [];

        if (blobParts) {
            var a = blobParts;
            var length = Number(a.length);
            for (var i = 0; i < length; i++) {
                var element = a[i];
                var buffer = void 0;
                if (element instanceof Buffer) {
                    buffer = element;
                } else if (ArrayBuffer.isView(element)) {
                    buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
                } else if (element instanceof ArrayBuffer) {
                    buffer = Buffer.from(element);
                } else if (element instanceof Blob) {
                    buffer = element[BUFFER];
                } else {
                    buffer = Buffer.from(typeof element === 'string' ? element : String(element));
                }
                buffers.push(buffer);
            }
        }

        this[BUFFER] = Buffer.concat(buffers);

        var type = options && options.type !== undefined && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
            this[TYPE] = type;
        }
    }

    _createClass(Blob, [{
        key: 'slice',
        value: function slice() {
            var size = this.size;

            var start = arguments[0];
            var end = arguments[1];
            var relativeStart = void 0,
                relativeEnd = void 0;
            if (start === undefined) {
                relativeStart = 0;
            } else if (start < 0) {
                relativeStart = Math.max(size + start, 0);
            } else {
                relativeStart = Math.min(start, size);
            }
            if (end === undefined) {
                relativeEnd = size;
            } else if (end < 0) {
                relativeEnd = Math.max(size + end, 0);
            } else {
                relativeEnd = Math.min(end, size);
            }
            var span = Math.max(relativeEnd - relativeStart, 0);

            var buffer = this[BUFFER];
            var slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
            var blob = new Blob([], { type: arguments[2] });
            blob[BUFFER] = slicedBuffer;
            return blob;
        }
    }, {
        key: 'size',
        get: function get() {
            return this[BUFFER].length;
        }
    }, {
        key: 'type',
        get: function get() {
            return this[TYPE];
        }
    }]);

    return Blob;
}();

exports.default = Blob;


Object.defineProperties(Blob.prototype, {
    size: { enumerable: true },
    type: { enumerable: true },
    slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: 'Blob',
    writable: false,
    enumerable: false,
    configurable: true
});
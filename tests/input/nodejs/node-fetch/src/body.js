// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Body;
exports.clone = clone;
exports.extractContentType = extractContentType;
exports.getTotalBytes = getTotalBytes;
exports.writeToStream = writeToStream;

var _blob = require('./blob.js');

var _blob2 = _interopRequireDefault(_blob);

var _fetchError = require('./fetch-error.js');

var _fetchError2 = _interopRequireDefault(_fetchError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * body.js
 *
 * Body interface provides common methods for Request and Response
 */

var Stream = require('stream');

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var convert = void 0;
try {
    convert = require('encoding').convert;
} catch (e) {}

var INTERNALS = Symbol('Body internals');

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
    var _this = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 0 : _ref$size,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

    if (body == null) {
        // body is undefined or null
        body = null;
    } else if (typeof body === 'string') {
        // body is string
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
    } else if (body instanceof _blob2.default) {
        // body is blob
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is array buffer
    } else if (body instanceof Stream) {
        // body is stream
    } else {
        // none of the above
        // coerce to string
        body = String(body);
    }
    this[INTERNALS] = {
        body: body,
        disturbed: false,
        error: null
    };
    this.size = size;
    this.timeout = timeout;

    if (body instanceof Stream) {
        body.on('error', function (err) {
            _this[INTERNALS].error = new _fetchError2.default('Invalid response body while trying to fetch ' + _this.url + ': ' + err.message, 'system', err);
        });
    }
}

Body.prototype = {
    get body() {
        return this[INTERNALS].body;
    },

    get bodyUsed() {
        return this[INTERNALS].disturbed;
    },

    /**
     * Decode response as ArrayBuffer
     *
     * @return  Promise
     */
    arrayBuffer: function arrayBuffer() {
        return consumeBody.call(this).then(function (buf) {
            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
    },


    /**
     * Return raw response as Blob
     *
     * @return Promise
     */
    blob: function blob() {
        var ct = this.headers && this.headers.get('content-type') || '';
        return consumeBody.call(this).then(function (buf) {
            return Object.assign(
                // Prevent copying
                new _blob2.default([], {
                    type: ct.toLowerCase()
                }), _defineProperty({}, _blob.BUFFER, buf));
        });
    },


    /**
     * Decode response as json
     *
     * @return  Promise
     */
    json: function json() {
        var _this2 = this;

        return consumeBody.call(this).then(function (buffer) {
            try {
                return JSON.parse(buffer.toString());
            } catch (err) {
                return Body.Promise.reject(new _fetchError2.default('invalid json response body at ' + _this2.url + ' reason: ' + err.message, 'invalid-json'));
            }
        });
    },


    /**
     * Decode response as text
     *
     * @return  Promise
     */
    text: function text() {
        return consumeBody.call(this).then(function (buffer) {
            return buffer.toString();
        });
    },


    /**
     * Decode response as buffer (non-spec api)
     *
     * @return  Promise
     */
    buffer: function buffer() {
        return consumeBody.call(this);
    },


    /**
     * Decode response as text, while automatically detecting the encoding and
     * trying to decode to UTF-8 (non-spec api)
     *
     * @return  Promise
     */
    textConverted: function textConverted() {
        var _this3 = this;

        return consumeBody.call(this).then(function (buffer) {
            return convertBody(buffer, _this3.headers);
        });
    }
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
    body: { enumerable: true },
    bodyUsed: { enumerable: true },
    arrayBuffer: { enumerable: true },
    blob: { enumerable: true },
    json: { enumerable: true },
    text: { enumerable: true }
});

Body.mixIn = function (proto) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.getOwnPropertyNames(Body.prototype)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            // istanbul ignore else: future proof
            if (!(name in proto)) {
                var desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
                Object.defineProperty(proto, name, desc);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
    var _this4 = this;

    if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError('body used already for: ' + this.url));
    }

    this[INTERNALS].disturbed = true;

    if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
    }

    // body is null
    if (this.body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }

    // body is string
    if (typeof this.body === 'string') {
        return Body.Promise.resolve(Buffer.from(this.body));
    }

    // body is blob
    if (this.body instanceof _blob2.default) {
        return Body.Promise.resolve(this.body[_blob.BUFFER]);
    }

    // body is buffer
    if (Buffer.isBuffer(this.body)) {
        return Body.Promise.resolve(this.body);
    }

    // body is buffer
    if (Object.prototype.toString.call(this.body) === '[object ArrayBuffer]') {
        return Body.Promise.resolve(Buffer.from(this.body));
    }

    // istanbul ignore if: should never happen
    if (!(this.body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }

    // body is stream
    // get ready to actually consume the body
    var accum = [];
    var accumBytes = 0;
    var abort = false;

    return new Body.Promise(function (resolve, reject) {
        var resTimeout = void 0;

        // allow timeout on slow response body
        if (_this4.timeout) {
            resTimeout = setTimeout(function () {
                abort = true;
                reject(new _fetchError2.default('Response timeout while trying to fetch ' + _this4.url + ' (over ' + _this4.timeout + 'ms)', 'body-timeout'));
            }, _this4.timeout);
        }

        // handle stream error, such as incorrect content-encoding
        _this4.body.on('error', function (err) {
            reject(new _fetchError2.default('Invalid response body while trying to fetch ' + _this4.url + ': ' + err.message, 'system', err));
        });

        _this4.body.on('data', function (chunk) {
            if (abort || chunk === null) {
                return;
            }

            if (_this4.size && accumBytes + chunk.length > _this4.size) {
                abort = true;
                reject(new _fetchError2.default('content size at ' + _this4.url + ' over limit: ' + _this4.size, 'max-size'));
                return;
            }

            accumBytes += chunk.length;
            accum.push(chunk);
        });

        _this4.body.on('end', function () {
            if (abort) {
                return;
            }

            clearTimeout(resTimeout);

            try {
                resolve(Buffer.concat(accum));
            } catch (err) {
                // handle streams that have accumulated too much data (issue #414)
                reject(new _fetchError2.default('Could not create Buffer from response body for ' + _this4.url + ': ' + err.message, 'system', err));
            }
        });
    });
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
    if (typeof convert !== 'function') {
        throw new Error('The package `encoding` must be installed to use the textConverted() function');
    }

    var ct = headers.get('content-type');
    var charset = 'utf-8';
    var res = void 0,
        str = void 0;

    // header
    if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
    }

    // no charset in content type, peek at response body for at most 1024 bytes
    str = buffer.slice(0, 1024).toString();

    // html5
    if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }

    // html4
    if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

        if (res) {
            res = /charset=(.*)/i.exec(res.pop());
        }
    }

    // xml
    if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }

    // found charset
    if (res) {
        charset = res.pop();

        // prevent decode issues when sites use incorrect encoding
        // ref: https://hsivonen.fi/encoding-menu/
        if (charset === 'gb2312' || charset === 'gbk') {
            charset = 'gb18030';
        }
    }

    // turn raw buffers into a single utf-8 buffer
    return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
    // Duck-typing as a necessary condition.
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
        return false;
    }

    // Brand-checking and more duck-typing as optional condition.
    return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
    var p1 = void 0,
        p2 = void 0;
    var body = instance.body;

    // don't allow cloning a used body
    if (instance.bodyUsed) {
        throw new Error('cannot clone body after it is used');
    }

    // check that body is a stream and not form-data object
    // note: we can't clone the form-data object without having it as a dependency
    if (body instanceof Stream && typeof body.getBoundary !== 'function') {
        // tee instance body
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        // set instance body to teed body and return the other teed body
        instance[INTERNALS].body = p1;
        body = p2;
    }

    return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Response or Request instance
 */
function extractContentType(instance) {
    var body = instance.body;

    // istanbul ignore if: Currently, because of a guard in Request, body
    // can never be null. Included here for completeness.

    if (body === null) {
        // body is null
        return null;
    } else if (typeof body === 'string') {
        // body is string
        return 'text/plain;charset=UTF-8';
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
        return 'application/x-www-form-urlencoded;charset=UTF-8';
    } else if (body instanceof _blob2.default) {
        // body is blob
        return body.type || null;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return null;
    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is array buffer
        return null;
    } else if (typeof body.getBoundary === 'function') {
        // detect form data input from form-data module
        return 'multipart/form-data;boundary=' + body.getBoundary();
    } else {
        // body is stream
        // can't really do much about this
        return null;
    }
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
    var body = instance.body;

    // istanbul ignore if: included for completion

    if (body === null) {
        // body is null
        return 0;
    } else if (typeof body === 'string') {
        // body is string
        return Buffer.byteLength(body);
    } else if (isURLSearchParams(body)) {
        // body is URLSearchParams
        return Buffer.byteLength(String(body));
    } else if (body instanceof _blob2.default) {
        // body is blob
        return body.size;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return body.length;
    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is array buffer
        return body.byteLength;
    } else if (body && typeof body.getLengthSync === 'function') {
        // detect form data input from form-data module
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
            body.hasKnownLength && body.hasKnownLength()) {
            // 2.x
            return body.getLengthSync();
        }
        return null;
    } else {
        // body is stream
        // can't really do much about this
        return null;
    }
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
    var body = instance.body;


    if (body === null) {
        // body is null
        dest.end();
    } else if (typeof body === 'string') {
        // body is string
        dest.write(body);
        dest.end();
    } else if (isURLSearchParams(body)) {
        // body is URLSearchParams
        dest.write(Buffer.from(String(body)));
        dest.end();
    } else if (body instanceof _blob2.default) {
        // body is blob
        dest.write(body[_blob.BUFFER]);
        dest.end();
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        dest.write(body);
        dest.end();
    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is array buffer
        dest.write(Buffer.from(body));
        dest.end();
    } else {
        // body is stream
        body.pipe(dest);
    }
}

// expose Promise
Body.Promise = global.Promise;
// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.exportNodeCompatibleHeaders = exportNodeCompatibleHeaders;
exports.createHeadersLenient = createHeadersLenient;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
    name = '' + name;
    if (invalidTokenRegex.test(name)) {
        throw new TypeError(name + ' is not a legal HTTP header name');
    }
}

function validateValue(value) {
    value = '' + value;
    if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(value + ' is not a legal HTTP header value');
    }
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
    name = name.toLowerCase();
    for (var key in map) {
        if (key.toLowerCase() === name) {
            return key;
        }
    }
    return undefined;
}

var MAP = Symbol('map');

var Headers = function () {
    /**
     * Headers class
     *
     * @param   Object  headers  Response headers
     * @return  Void
     */
    function Headers() {
        var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

        _classCallCheck(this, Headers);

        this[MAP] = Object.create(null);

        if (init instanceof Headers) {
            var rawHeaders = init.raw();
            var headerNames = Object.keys(rawHeaders);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = headerNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var headerName = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = rawHeaders[headerName][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var value = _step2.value;

                            this.append(headerName, value);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
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

            return;
        }

        // We don't worry about converting prop to ByteString here as append()
        // will handle it.
        if (init == null) {
            // no op
        } else if ((typeof init === 'undefined' ? 'undefined' : _typeof(init)) === 'object') {
            var method = init[Symbol.iterator];
            if (method != null) {
                if (typeof method !== 'function') {
                    throw new TypeError('Header pairs must be iterable');
                }

                // sequence<sequence<ByteString>>
                // Note: per spec we have to first exhaust the lists then process them
                var pairs = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = init[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var pair = _step3.value;

                        if ((typeof pair === 'undefined' ? 'undefined' : _typeof(pair)) !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
                            throw new TypeError('Each header pair must be iterable');
                        }
                        pairs.push(Array.from(pair));
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = pairs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _pair = _step4.value;

                        if (_pair.length !== 2) {
                            throw new TypeError('Each header pair must be a name/value tuple');
                        }
                        this.append(_pair[0], _pair[1]);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else {
                // record<ByteString, ByteString>
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = Object.keys(init)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var key = _step5.value;

                        var _value = init[key];
                        this.append(key, _value);
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        } else {
            throw new TypeError('Provided initializer must be an object');
        }
    }

    /**
     * Return combined header value given name
     *
     * @param   String  name  Header name
     * @return  Mixed
     */


    _createClass(Headers, [{
        key: 'get',
        value: function get(name) {
            name = '' + name;
            validateName(name);
            var key = find(this[MAP], name);
            if (key === undefined) {
                return null;
            }

            return this[MAP][key].join(', ');
        }

        /**
         * Iterate over all headers
         *
         * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
         * @param   Boolean   thisArg   `this` context for callback function
         * @return  Void
         */

    }, {
        key: 'forEach',
        value: function forEach(callback) {
            var thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var pairs = getHeaders(this);
            var i = 0;
            while (i < pairs.length) {
                var _pairs$i = _slicedToArray(pairs[i], 2),
                    name = _pairs$i[0],
                    value = _pairs$i[1];

                callback.call(thisArg, value, name, this);
                pairs = getHeaders(this);
                i++;
            }
        }

        /**
         * Overwrite header values given name
         *
         * @param   String  name   Header name
         * @param   String  value  Header value
         * @return  Void
         */

    }, {
        key: 'set',
        value: function set(name, value) {
            name = '' + name;
            value = '' + value;
            validateName(name);
            validateValue(value);
            var key = find(this[MAP], name);
            this[MAP][key !== undefined ? key : name] = [value];
        }

        /**
         * Append a value onto existing header
         *
         * @param   String  name   Header name
         * @param   String  value  Header value
         * @return  Void
         */

    }, {
        key: 'append',
        value: function append(name, value) {
            name = '' + name;
            value = '' + value;
            validateName(name);
            validateValue(value);
            var key = find(this[MAP], name);
            if (key !== undefined) {
                this[MAP][key].push(value);
            } else {
                this[MAP][name] = [value];
            }
        }

        /**
         * Check for header name existence
         *
         * @param   String   name  Header name
         * @return  Boolean
         */

    }, {
        key: 'has',
        value: function has(name) {
            name = '' + name;
            validateName(name);
            return find(this[MAP], name) !== undefined;
        }

        /**
         * Delete all header values given name
         *
         * @param   String  name  Header name
         * @return  Void
         */

    }, {
        key: 'delete',
        value: function _delete(name) {
            name = '' + name;
            validateName(name);
            var key = find(this[MAP], name);
            if (key !== undefined) {
                delete this[MAP][key];
            }
        }
    }, {
        key: 'raw',


        /**
         * Return raw headers (non-spec api)
         *
         * @return  Object
         */
        value: function raw() {
            return this[MAP];
        }

        /**
         * Get an iterator on keys.
         *
         * @return  Iterator
         */

    }, {
        key: 'keys',
        value: function keys() {
            return createHeadersIterator(this, 'key');
        }

        /**
         * Get an iterator on values.
         *
         * @return  Iterator
         */

    }, {
        key: 'values',
        value: function values() {
            return createHeadersIterator(this, 'value');
        }

        /**
         * Get an iterator on entries.
         *
         * This is the default iterator of the Headers object.
         *
         * @return  Iterator
         */

    }, {
        key: Symbol.iterator,
        value: function value() {
            return createHeadersIterator(this, 'key+value');
        }
    }]);

    return Headers;
}();

exports.default = Headers;

Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: 'Headers',
    writable: false,
    enumerable: false,
    configurable: true
});

Object.defineProperties(Headers.prototype, {
    get: { enumerable: true },
    forEach: { enumerable: true },
    set: { enumerable: true },
    append: { enumerable: true },
    has: { enumerable: true },
    delete: { enumerable: true },
    keys: { enumerable: true },
    values: { enumerable: true },
    entries: { enumerable: true }
});

function getHeaders(headers) {
    var kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

    var keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === 'key' ? function (k) {
        return k.toLowerCase();
    } : kind === 'value' ? function (k) {
        return headers[MAP][k].join(', ');
    } : function (k) {
        return [k.toLowerCase(), headers[MAP][k].join(', ')];
    });
}

var INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
    var iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
        target: target,
        kind: kind,
        index: 0
    };
    return iterator;
}

var HeadersIteratorPrototype = Object.setPrototypeOf({
    next: function next() {
        // istanbul ignore if
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
            throw new TypeError('Value of `this` is not a HeadersIterator');
        }

        var _INTERNAL = this[INTERNAL],
            target = _INTERNAL.target,
            kind = _INTERNAL.kind,
            index = _INTERNAL.index;

        var values = getHeaders(target, kind);
        var len = values.length;
        if (index >= len) {
            return {
                value: undefined,
                done: true
            };
        }

        this[INTERNAL].index = index + 1;

        return {
            value: values[index],
            done: false
        };
    }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: 'HeadersIterator',
    writable: false,
    enumerable: false,
    configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
    var obj = Object.assign({ __proto__: null }, headers[MAP]);

    // http.request() only supports string as Host header. This hack makes
    // specifying custom Host header possible.
    var hostHeaderKey = find(headers[MAP], 'Host');
    if (hostHeaderKey !== undefined) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }

    return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
    var headers = new Headers();
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = Object.keys(obj)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var name = _step6.value;

            if (invalidTokenRegex.test(name)) {
                continue;
            }
            if (Array.isArray(obj[name])) {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = obj[name][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var val = _step7.value;

                        if (invalidHeaderCharRegex.test(val)) {
                            continue;
                        }
                        if (headers[MAP][name] === undefined) {
                            headers[MAP][name] = [val];
                        } else {
                            headers[MAP][name].push(val);
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            } else if (!invalidHeaderCharRegex.test(obj[name])) {
                headers[MAP][name] = [obj[name]];
            }
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
            }
        } finally {
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }

    return headers;
}
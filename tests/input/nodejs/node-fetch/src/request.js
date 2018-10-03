// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/**
 * request.js
 *
 * Request class contains server only options
 *
 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
 */

exports.getNodeRequestOptions = getNodeRequestOptions;

var _headers = require('./headers.js');

var _headers2 = _interopRequireDefault(_headers);

var _body = require('./body');

var _body2 = _interopRequireDefault(_body);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('url'),
    format_url = _require.format,
    parse_url = _require.parse;

var INTERNALS = Symbol('Request internals');

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
    return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && _typeof(input[INTERNALS]) === 'object';
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */

var Request = function () {
    function Request(input) {
        var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Request);

        var parsedURL = void 0;

        // normalize input
        if (!isRequest(input)) {
            if (input && input.href) {
                // in order to support Node.js' Url objects; though WHATWG's URL objects
                // will fall into this branch also (since their `toString()` will return
                // `href` property anyway)
                parsedURL = parse_url(input.href);
            } else {
                // coerce input to a string before attempting to parse
                parsedURL = parse_url('' + input);
            }
            input = {};
        } else {
            parsedURL = parse_url(input.url);
        }

        var method = init.method || input.method || 'GET';
        method = method.toUpperCase();

        if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
            throw new TypeError('Request with GET/HEAD method cannot have body');
        }

        var inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? (0, _body.clone)(input) : null;

        _body2.default.call(this, inputBody, {
            timeout: init.timeout || input.timeout || 0,
            size: init.size || input.size || 0
        });

        var headers = new _headers2.default(init.headers || input.headers || {});

        if (init.body != null) {
            var contentType = (0, _body.extractContentType)(this);
            if (contentType !== null && !headers.has('Content-Type')) {
                headers.append('Content-Type', contentType);
            }
        }

        this[INTERNALS] = {
            method: method,
            redirect: init.redirect || input.redirect || 'follow',
            headers: headers,
            parsedURL: parsedURL
        };

        // node-fetch-only options
        this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
        this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
    }

    _createClass(Request, [{
        key: 'clone',


        /**
         * Clone this request
         *
         * @return  Request
         */
        value: function clone() {
            return new Request(this);
        }
    }, {
        key: 'method',
        get: function get() {
            return this[INTERNALS].method;
        }
    }, {
        key: 'url',
        get: function get() {
            return format_url(this[INTERNALS].parsedURL);
        }
    }, {
        key: 'headers',
        get: function get() {
            return this[INTERNALS].headers;
        }
    }, {
        key: 'redirect',
        get: function get() {
            return this[INTERNALS].redirect;
        }
    }]);

    return Request;
}();

exports.default = Request;


_body2.default.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: 'Request',
    writable: false,
    enumerable: false,
    configurable: true
});

Object.defineProperties(Request.prototype, {
    method: { enumerable: true },
    url: { enumerable: true },
    headers: { enumerable: true },
    redirect: { enumerable: true },
    clone: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
    var parsedURL = request[INTERNALS].parsedURL;
    var headers = new _headers2.default(request[INTERNALS].headers);

    // fetch step 1.3
    if (!headers.has('Accept')) {
        headers.set('Accept', '*/*');
    }

    // Basic fetch
    if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError('Only absolute URLs are supported');
    }

    if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError('Only HTTP(S) protocols are supported');
    }

    // HTTP-network-or-cache fetch steps 2.4-2.7
    var contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = '0';
    }
    if (request.body != null) {
        var totalBytes = (0, _body.getTotalBytes)(request);
        if (typeof totalBytes === 'number') {
            contentLengthValue = String(totalBytes);
        }
    }
    if (contentLengthValue) {
        headers.set('Content-Length', contentLengthValue);
    }

    // HTTP-network-or-cache fetch step 2.11
    if (!headers.has('User-Agent')) {
        headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
    }

    // HTTP-network-or-cache fetch step 2.15
    if (request.compress) {
        headers.set('Accept-Encoding', 'gzip,deflate');
    }
    if (!headers.has('Connection') && !request.agent) {
        headers.set('Connection', 'close');
    }

    // HTTP-network fetch step 4.2
    // chunked encoding is handled by Node.js

    return Object.assign({}, parsedURL, {
        method: request.method,
        headers: (0, _headers.exportNodeCompatibleHeaders)(headers),
        agent: request.agent
    });
}
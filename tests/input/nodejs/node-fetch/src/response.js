// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * response.js
 *
 * Response class provides content decoding
 */

var _headers = require('./headers.js');

var _headers2 = _interopRequireDefault(_headers);

var _body = require('./body');

var _body2 = _interopRequireDefault(_body);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('http'),
    STATUS_CODES = _require.STATUS_CODES;

var INTERNALS = Symbol('Response internals');

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */

var Response = function () {
    function Response() {
        var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Response);

        _body2.default.call(this, body, opts);

        var status = opts.status || 200;

        this[INTERNALS] = {
            url: opts.url,
            status: status,
            statusText: opts.statusText || STATUS_CODES[status],
            headers: new _headers2.default(opts.headers)
        };
    }

    _createClass(Response, [{
        key: 'clone',


        /**
         * Clone this response
         *
         * @return  Response
         */
        value: function clone() {
            return new Response((0, _body.clone)(this), {
                url: this.url,
                status: this.status,
                statusText: this.statusText,
                headers: this.headers,
                ok: this.ok
            });
        }
    }, {
        key: 'url',
        get: function get() {
            return this[INTERNALS].url;
        }
    }, {
        key: 'status',
        get: function get() {
            return this[INTERNALS].status;
        }

        /**
         * Convenience property representing if the request ended normally
         */

    }, {
        key: 'ok',
        get: function get() {
            return this[INTERNALS].status >= 200 && this[INTERNALS].status < 300;
        }
    }, {
        key: 'statusText',
        get: function get() {
            return this[INTERNALS].statusText;
        }
    }, {
        key: 'headers',
        get: function get() {
            return this[INTERNALS].headers;
        }
    }]);

    return Response;
}();

exports.default = Response;


_body2.default.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
    url: { enumerable: true },
    status: { enumerable: true },
    ok: { enumerable: true },
    statusText: { enumerable: true },
    headers: { enumerable: true },
    clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: 'Response',
    writable: false,
    enumerable: false,
    configurable: true
});
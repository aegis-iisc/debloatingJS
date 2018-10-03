// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FetchError = exports.Response = exports.Request = exports.Headers = undefined;
exports.default = fetch;

var _body = require('./body');

var _body2 = _interopRequireDefault(_body);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _fetchError = require('./fetch-error');

var _fetchError2 = _interopRequireDefault(_fetchError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
/**
 * index.js
 *
 * a request API compatible with window.fetch
 *
 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
 */

var https = require('https');

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var _require2 = require('url'),
    resolve_url = _require2.resolve;

var zlib = require('zlib');

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

    // allow custom promise
    if (!fetch.Promise) {
        throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
    }

    _body2.default.Promise = fetch.Promise;

    // wrap http.request into fetch
    return new fetch.Promise(function (resolve, reject) {
        // build request object
        var request = new _request2.default(url, opts);
        var options = (0, _request.getNodeRequestOptions)(request);

        var send = (options.protocol === 'https:' ? https : http).request;

        // send request
        var req = send(options);
        var reqTimeout = void 0;

        function finalize() {
            req.abort();
            clearTimeout(reqTimeout);
        }

        if (request.timeout) {
            req.once('socket', function (socket) {
                reqTimeout = setTimeout(function () {
                    reject(new _fetchError2.default('network timeout at: ' + request.url, 'request-timeout'));
                    finalize();
                }, request.timeout);
            });
        }

        req.on('error', function (err) {
            reject(new _fetchError2.default('request to ' + request.url + ' failed, reason: ' + err.message, 'system', err));
            finalize();
        });

        req.on('response', function (res) {
            clearTimeout(reqTimeout);

            var headers = (0, _headers.createHeadersLenient)(res.headers);

            // HTTP fetch step 5
            if (fetch.isRedirect(res.statusCode)) {
                // HTTP fetch step 5.2
                var location = headers.get('Location');

                // HTTP fetch step 5.3
                var locationURL = location === null ? null : resolve_url(request.url, location);

                // HTTP fetch step 5.5
                switch (request.redirect) {
                    case 'error':
                        reject(new _fetchError2.default('redirect mode is set to error: ' + request.url, 'no-redirect'));
                        finalize();
                        return;
                    case 'manual':
                        // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
                        if (locationURL !== null) {
                            headers.set('Location', locationURL);
                        }
                        break;
                    case 'follow':
                        // HTTP-redirect fetch step 2
                        if (locationURL === null) {
                            break;
                        }

                        // HTTP-redirect fetch step 5
                        if (request.counter >= request.follow) {
                            reject(new _fetchError2.default('maximum redirect reached at: ' + request.url, 'max-redirect'));
                            finalize();
                            return;
                        }

                        // HTTP-redirect fetch step 6 (counter increment)
                        // Create a new Request object.
                        var requestOpts = {
                            headers: new _headers2.default(request.headers),
                            follow: request.follow,
                            counter: request.counter + 1,
                            agent: request.agent,
                            compress: request.compress,
                            method: request.method,
                            body: request.body
                        };

                        // HTTP-redirect fetch step 9
                        if (res.statusCode !== 303 && request.body && (0, _body.getTotalBytes)(request) === null) {
                            reject(new _fetchError2.default('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
                            finalize();
                            return;
                        }

                        // HTTP-redirect fetch step 11
                        if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
                            requestOpts.method = 'GET';
                            requestOpts.body = undefined;
                            requestOpts.headers.delete('content-length');
                        }

                        // HTTP-redirect fetch step 15
                        resolve(fetch(new _request2.default(locationURL, requestOpts)));
                        finalize();
                        return;
                }
            }

            // prepare response
            var body = res.pipe(new PassThrough());
            var response_options = {
                url: request.url,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: headers,
                size: request.size,
                timeout: request.timeout
            };

            // HTTP-network fetch step 12.1.1.3
            var codings = headers.get('Content-Encoding');

            // HTTP-network fetch step 12.1.1.4: handle content codings

            // in following scenarios we ignore compression support
            // 1. compression support is disabled
            // 2. HEAD request
            // 3. no Content-Encoding header
            // 4. no content response (204)
            // 5. content not modified response (304)
            if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
                resolve(new _response2.default(body, response_options));
                return;
            }

            // For Node v6+
            // Be less strict when decoding compressed responses, since sometimes
            // servers send slightly invalid responses that are still accepted
            // by common browsers.
            // Always using Z_SYNC_FLUSH is what cURL does.
            var zlibOptions = {
                flush: zlib.Z_SYNC_FLUSH,
                finishFlush: zlib.Z_SYNC_FLUSH
            };

            // for gzip
            if (codings == 'gzip' || codings == 'x-gzip') {
                body = body.pipe(zlib.createGunzip(zlibOptions));
                resolve(new _response2.default(body, response_options));
                return;
            }

            // for deflate
            if (codings == 'deflate' || codings == 'x-deflate') {
                // handle the infamous raw deflate response from old servers
                // a hack for old IIS and Apache servers
                var raw = res.pipe(new PassThrough());
                raw.once('data', function (chunk) {
                    // see http://stackoverflow.com/questions/37519828
                    if ((chunk[0] & 0x0F) === 0x08) {
                        body = body.pipe(zlib.createInflate());
                    } else {
                        body = body.pipe(zlib.createInflateRaw());
                    }
                    resolve(new _response2.default(body, response_options));
                });
                return;
            }

            // otherwise, use response as-is
            resolve(new _response2.default(body, response_options));
        });

        (0, _body.writeToStream)(req, request);
    });
};

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// Needed for TypeScript.
fetch.default = fetch;

// expose Promise
fetch.Promise = global.Promise;
exports.Headers = _headers2.default;
exports.Request = _request2.default;
exports.Response = _response2.default;
exports.FetchError = _fetchError2.default;
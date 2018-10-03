// 'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _chaiIterator = require('chai-iterator');

var _chaiIterator2 = _interopRequireDefault(_chaiIterator);

var _chaiString = require('chai-string');

var _chaiString2 = _interopRequireDefault(_chaiString);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _resumer = require('resumer');

var _resumer2 = _interopRequireDefault(_resumer);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _stringToArraybuffer = require('string-to-arraybuffer');

var _stringToArraybuffer2 = _interopRequireDefault(_stringToArraybuffer);

var _urlSearchParams = require('url-search-params');

var _urlSearchParams2 = _interopRequireDefault(_urlSearchParams);

var _whatwgUrl = require('whatwg-url');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _src = require('../src/');

var _src2 = _interopRequireDefault(_src);

var _fetchError = require('../src/fetch-error.js');

var _fetchError2 = _interopRequireDefault(_fetchError);

var _headers = require('../src/headers.js');

var _headers2 = _interopRequireDefault(_headers);

var _request = require('../src/request.js');

var _request2 = _interopRequireDefault(_request);

var _response = require('../src/response.js');

var _response2 = _interopRequireDefault(_response);

var _body = require('../src/body.js');

var _body2 = _interopRequireDefault(_body);

var _blob = require('../src/blob.js');

var _blob2 = _interopRequireDefault(_blob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// test tools


var _require = require('child_process'),
    spawn = _require.spawn;

var http = require('http');
var fs = require('fs');
var path = require('path');
var stream = require('stream');

var _require2 = require('url'),
    parseURL = _require2.parse,
    URLSearchParams = _require2.URLSearchParams;

var convert = void 0;
try {
    convert = require('encoding').convert;
} catch (e) {}

_chai2.default.use(_chaiAsPromised2.default);
_chai2.default.use(_chaiIterator2.default);
_chai2.default.use(_chaiString2.default);
var expect = _chai2.default.expect;

// test subjects


var supportToString = _defineProperty({}, Symbol.toStringTag, 'z').toString() === '[object z]';

var local = new _server2.default();
var base = 'http://' + local.hostname + ':' + local.port + '/';

var testNumber = 40;

function getTestIdentifier () {
    testNumber ++;
    return 'test' + testNumber + ' >> ';
}

before(function (done) {
    local.start(done);
});

after(function (done) {
    local.stop(done);
});

describe('node-fetch', function () {
    it('test1 >> should return a promise', function () {
        var url = base + 'hello';
        var p = (0, _src2.default)(url);
        expect(p).to.be.an.instanceof(_src2.default.Promise);
        expect(p).to.have.property('then');
    });

    it('test2 >> should allow custom promise', function () {
        var url = base + 'hello';
        var old = _src2.default.Promise;
        _src2.default.Promise = _promise2.default;
        expect((0, _src2.default)(url)).to.be.an.instanceof(_promise2.default);
        expect((0, _src2.default)(url)).to.not.be.an.instanceof(old);
        _src2.default.Promise = old;
    });

    it('test3 >> should throw error when no promise implementation are found', function () {
        var url = base + 'hello';
        var old = _src2.default.Promise;
        _src2.default.Promise = undefined;
        expect(function () {
            (0, _src2.default)(url);
        }).to.throw(Error);
        _src2.default.Promise = old;
    });

    it('test4 >> should expose Headers, Response and Request constructors', function () {
        expect(_src.FetchError).to.equal(_fetchError2.default);
        expect(_src.Headers).to.equal(_headers2.default);
        expect(_src.Response).to.equal(_response2.default);
        expect(_src.Request).to.equal(_request2.default);
    });

    (supportToString ? it : it.skip)('should support proper toString output for Headers, Response and Request objects', function () {
        expect(new _src.Headers().toString()).to.equal('[object Headers]');
        expect(new _src.Response().toString()).to.equal('[object Response]');
        expect(new _src.Request(base).toString()).to.equal('[object Request]');
    });

    it('test5 >> should reject with error if url is protocol relative', function () {
        var url = '//example.com/';
        return expect((0, _src2.default)(url)).to.eventually.be.rejectedWith(TypeError, 'Only absolute URLs are supported');
    });

    it('test6 >> should reject with error if url is relative path', function () {
        var url = '/some/path';
        return expect((0, _src2.default)(url)).to.eventually.be.rejectedWith(TypeError, 'Only absolute URLs are supported');
    });

    it('test7 >> should reject with error if protocol is unsupported', function () {
        var url = 'ftp://example.com/';
        return expect((0, _src2.default)(url)).to.eventually.be.rejectedWith(TypeError, 'Only HTTP(S) protocols are supported');
    });

    // it('test8 >> should reject with error on network failure', function () {
    //     var url = 'http://localhost:50000/';
    //     return expect((0, _src2.default)(url)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.include({ type: 'system', code: 'ECONNREFUSED', errno: 'ECONNREFUSED' });
    // });

    it('test9 >> should resolve into response', function () {
        var url = base + 'hello';
        return (0, _src2.default)(url).then(function (res) {
            expect(res).to.be.an.instanceof(_src.Response);
            expect(res.headers).to.be.an.instanceof(_src.Headers);
            expect(res.body).to.be.an.instanceof(stream.Transform);
            expect(res.bodyUsed).to.be.false;

            expect(res.url).to.equal(url);
            expect(res.ok).to.be.true;
            expect(res.status).to.equal(200);
            expect(res.statusText).to.equal('OK');
        });
    });

    it('test10 >> should accept plain text response', function () {
        var url = base + 'plain';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                expect(result).to.be.a('string');
                expect(result).to.equal('text');
            });
        });
    });

    it('test11 >> should accept html response (like plain text)', function () {
        var url = base + 'html';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/html');
            return res.text().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                expect(result).to.be.a('string');
                expect(result).to.equal('<html></html>');
            });
        });
    });

    it('test12 >> should accept json response', function () {
        var url = base + 'json';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('application/json');
            return res.json().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                expect(result).to.be.an('object');
                expect(result).to.deep.equal({ name: 'value' });
            });
        });
    });

    it('test13 >> should send request with custom headers', function () {
        var url = base + 'inspect';
        var opts = {
            headers: { 'x-custom-header': 'abc' }
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['x-custom-header']).to.equal('abc');
        });
    });

    it('test14 >> should accept headers instance', function () {
        var url = base + 'inspect';
        var opts = {
            headers: new _src.Headers({ 'x-custom-header': 'abc' })
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['x-custom-header']).to.equal('abc');
        });
    });

    it('test15 >> should accept custom host header', function () {
        var url = base + 'inspect';
        var opts = {
            headers: {
                host: 'example.com'
            }
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['host']).to.equal('example.com');
        });
    });

    it('test16 >> should accept custom HoSt header', function () {
        var url = base + 'inspect';
        var opts = {
            headers: {
                HoSt: 'example.com'
            }
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['host']).to.equal('example.com');
        });
    });

    it('test17 >> should follow redirect code 301', function () {
        var url = base + 'redirect/301';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        });
    });

    it('test18 >> should follow redirect code 302', function () {
        var url = base + 'redirect/302';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test19 >> should follow redirect code 303', function () {
        var url = base + 'redirect/303';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test20 >> should follow redirect code 307', function () {
        var url = base + 'redirect/307';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test21 >> should follow redirect code 308', function () {
        var url = base + 'redirect/308';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test22 >> should follow redirect chain', function () {
        var url = base + 'redirect/chain';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test23 >> should follow POST request redirect code 301 with GET', function () {
        var url = base + 'redirect/301';
        var opts = {
            method: 'POST',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            return res.json().then(function (result) {
                expect(result.method).to.equal('GET');
                expect(result.body).to.equal('');
            });
        });
    });

    it('test24 >> should follow PATCH request redirect code 301 with PATCH', function () {
        var url = base + 'redirect/301';
        var opts = {
            method: 'PATCH',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            return res.json().then(function (res) {
                expect(res.method).to.equal('PATCH');
                expect(res.body).to.equal('a=1');
            });
        });
    });

    it('test25 >> should follow POST request redirect code 302 with GET', function () {
        var url = base + 'redirect/302';
        var opts = {
            method: 'POST',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            return res.json().then(function (result) {
                expect(result.method).to.equal('GET');
                expect(result.body).to.equal('');
            });
        });
    });

    it('test26 >> should follow PATCH request redirect code 302 with PATCH', function () {
        var url = base + 'redirect/302';
        var opts = {
            method: 'PATCH',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            return res.json().then(function (res) {
                expect(res.method).to.equal('PATCH');
                expect(res.body).to.equal('a=1');
            });
        });
    });

    it('test27 >> should follow redirect code 303 with GET', function () {
        var url = base + 'redirect/303';
        var opts = {
            method: 'PUT',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
            return res.json().then(function (result) {
                expect(result.method).to.equal('GET');
                expect(result.body).to.equal('');
            });
        });
    });

    // it('test28 >> should follow PATCH request redirect code 307 with PATCH', function () {
    //     var url = base + 'redirect/307';
    //     var opts = {
    //         method: 'PATCH',
    //         body: 'a=1'
    //     };
    //     return (0, _src2.default)(url, opts).then(function (res) {
    //         expect(res.url).to.equal(base + 'inspect');
    //         expect(res.status).to.equal(200);
    //         return res.json().then(function (result) {
    //             expect(result.method).to.equal('PATCH');
    //             expect(result.body).to.equal('a=1');
    //         });
    //     });
    // });

    // it('test29 >> should not follow non-GET redirect if body is a readable stream', function () {
    //     var url = base + 'redirect/307';
    //     var opts = {
    //         method: 'PATCH',
    //         body: (0, _resumer2.default)().queue('a=1').end()
    //     };
    //     return expect((0, _src2.default)(url, opts)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'unsupported-redirect');
    // });

    // it('test30 >> should obey maximum redirect, reject case', function () {
    //     var url = base + 'redirect/chain';
    //     var opts = {
    //         follow: 1
    //     };
    //     return expect((0, _src2.default)(url, opts)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'max-redirect');
    // });

    it('test31 >> should obey redirect chain, resolve case', function () {
        var url = base + 'redirect/chain';
        var opts = {
            follow: 2
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            expect(res.status).to.equal(200);
        });
    });

    it('test32 >> should allow not following redirect', function () {
        var url = base + 'redirect/301';
        var opts = {
            follow: 0
        };
        return expect((0, _src2.default)(url, opts)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'max-redirect');
    });

    it('test33 >> should support redirect mode, manual flag', function () {
        var url = base + 'redirect/301';
        var opts = {
            redirect: 'manual'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.status).to.equal(301);
            expect(res.headers.get('location')).to.equal(base + 'inspect');
        });
    });

    it('test34 >> should support redirect mode, error flag', function () {
        var url = base + 'redirect/301';
        var opts = {
            redirect: 'error'
        };
        return expect((0, _src2.default)(url, opts)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'no-redirect');
    });

    it('test35 >> should support redirect mode, manual flag when there is no redirect', function () {
        var url = base + 'hello';
        var opts = {
            redirect: 'manual'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.status).to.equal(200);
            expect(res.headers.get('location')).to.be.null;
        });
    });

    it('test36 >> should follow redirect code 301 and keep existing headers', function () {
        var url = base + 'redirect/301';
        var opts = {
            headers: new _src.Headers({ 'x-custom-header': 'abc' })
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(base + 'inspect');
            return res.json();
        }).then(function (res) {
            expect(res.headers['x-custom-header']).to.equal('abc');
        });
    });

    it('test37 >> should treat broken redirect as ordinary response (follow)', function () {
        var url = base + 'redirect/no-location';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.status).to.equal(301);
            expect(res.headers.get('location')).to.be.null;
        });
    });

    it('test38 >> should treat broken redirect as ordinary response (manual)', function () {
        var url = base + 'redirect/no-location';
        var opts = {
            redirect: 'manual'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.status).to.equal(301);
            expect(res.headers.get('location')).to.be.null;
        });
    });

    it('test39 >> should ignore invalid headers', function () {
        var url = base + 'invalid-header';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('Invalid-Header')).to.be.null;
            expect(res.headers.get('Invalid-Header-Value')).to.be.null;
            expect(res.headers.get('Set-Cookie')).to.be.null;
            expect(Array.from(res.headers.keys()).length).to.equal(4);
            expect(res.headers.has('Connection')).to.be.true;
            expect(res.headers.has('Content-Type')).to.be.true;
            expect(res.headers.has('Date')).to.be.true;
            expect(res.headers.has('Transfer-Encoding')).to.be.true;
        });
    });

    it('test40 >> should handle client-error response', function () {
        var url = base + 'error/400';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            expect(res.status).to.equal(400);
            expect(res.statusText).to.equal('Bad Request');
            expect(res.ok).to.be.false;
            return res.text().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                expect(result).to.be.a('string');
                expect(result).to.equal('client error');
            });
        });
    });

    it(getTestIdentifier() + 'should handle server-error response', function () {
        var url = base + 'error/500';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            expect(res.status).to.equal(500);
            expect(res.statusText).to.equal('Internal Server Error');
            expect(res.ok).to.be.false;
            return res.text().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                expect(result).to.be.a('string');
                expect(result).to.equal('server error');
            });
        });
    });

    it(getTestIdentifier() + 'should handle network-error response', function () {
        var url = base + 'error/reset';
        return expect((0, _src2.default)(url)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('code', 'ECONNRESET');
    });

    it(getTestIdentifier() + 'should handle DNS-error response', function () {
        var url = 'http://domain.invalid';
        return expect((0, _src2.default)(url)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('code', 'ENOTFOUND');
    });

    it(getTestIdentifier() + 'should reject invalid json response', function () {
        var url = base + 'error/json';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('application/json');
            return expect(res.json()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.include({ type: 'invalid-json' });
        });
    });

    it(getTestIdentifier() + 'should handle no content response', function () {
        var url = base + 'no-content';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(204);
            expect(res.statusText).to.equal('No Content');
            expect(res.ok).to.be.true;
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.be.empty;
            });
        });
    });

    it(getTestIdentifier() + 'should reject when trying to parse no content response as json', function () {
        var url = base + 'no-content';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(204);
            expect(res.statusText).to.equal('No Content');
            expect(res.ok).to.be.true;
            return expect(res.json()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.include({ type: 'invalid-json' });
        });
    });

    it(getTestIdentifier() + 'should handle no content response with gzip encoding', function () {
        var url = base + 'no-content/gzip';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(204);
            expect(res.statusText).to.equal('No Content');
            expect(res.headers.get('content-encoding')).to.equal('gzip');
            expect(res.ok).to.be.true;
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.be.empty;
            });
        });
    });

    it(getTestIdentifier() + 'should handle not modified response', function () {
        var url = base + 'not-modified';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(304);
            expect(res.statusText).to.equal('Not Modified');
            expect(res.ok).to.be.false;
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.be.empty;
            });
        });
    });

    it(getTestIdentifier() + 'should handle not modified response with gzip encoding', function () {
        var url = base + 'not-modified/gzip';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(304);
            expect(res.statusText).to.equal('Not Modified');
            expect(res.headers.get('content-encoding')).to.equal('gzip');
            expect(res.ok).to.be.false;
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.be.empty;
            });
        });
    });

    it(getTestIdentifier() + 'should decompress gzip response', function () {
        var url = base + 'gzip';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.equal('hello world');
            });
        });
    });
// 51
    it(getTestIdentifier() + 'should decompress slightly invalid gzip response', function () {
        var url = base + 'gzip-truncated';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.equal('hello world');
            });
        });
    });

    it(getTestIdentifier() + 'should decompress deflate response', function () {
        var url = base + 'deflate';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.equal('hello world');
            });
        });
    });

    it(getTestIdentifier() + 'should decompress deflate raw response from old apache server', function () {
        var url = base + 'deflate-raw';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.equal('hello world');
            });
        });
    });

    it(getTestIdentifier() + 'should skip decompression if unsupported', function () {
        var url = base + 'sdch';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.equal('fake sdch string');
            });
        });
    });

    it(getTestIdentifier() + 'should reject if response compression is invalid', function () {
        var url = base + 'invalid-content-encoding';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return expect(res.text()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('code', 'Z_DATA_ERROR');
        });
    });

    it(getTestIdentifier() + 'should handle errors on the body stream even if it is not used', function (done) {
        var url = base + 'invalid-content-encoding';
        (0, _src2.default)(url).then(function (res) {
            expect(res.status).to.equal(200);
        }).catch(function () {}).then(function () {
            // Wait a few ms to see if a uncaught error occurs
            setTimeout(function () {
                done();
            }, 50);
        });
    });

    it(getTestIdentifier() + 'should collect handled errors on the body stream to reject if the body is used later', function () {

        function delay(value) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(value);
                }, 100);
            });
        }

        var url = base + 'invalid-content-encoding';
        return (0, _src2.default)(url).then(delay).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return expect(res.text()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('code', 'Z_DATA_ERROR');
        });
    });

    it(getTestIdentifier() + 'should allow disabling auto decompression', function () {
        var url = base + 'gzip';
        var opts = {
            compress: false
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(result).to.be.a('string');
                expect(result).to.not.equal('hello world');
            });
        });
    });

    it(getTestIdentifier() + 'should allow custom timeout', function () {
        this.timeout(500);
        var url = base + 'timeout';
        var opts = {
            timeout: 100
        };
        return expect((0, _src2.default)(url, opts)).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'request-timeout');
    });

    it(getTestIdentifier() + 'should allow custom timeout on response body', function () {
        this.timeout(500);
        var url = base + 'slow';
        var opts = {
            timeout: 100
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.ok).to.be.true;
            return expect(res.text()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'body-timeout');
        });
    });
// 61
    it(getTestIdentifier() + 'should clear internal timeout on fetch response', function (done) {
        this.timeout(2000);
        spawn('node', ['-e', 'require(\'./\')(\'' + base + 'hello\', { timeout: 10000 })']).on('exit', function () {
            done();
        });
    });

    it(getTestIdentifier() + 'should clear internal timeout on fetch redirect', function (done) {
        this.timeout(2000);
        spawn('node', ['-e', 'require(\'./\')(\'' + base + 'redirect/301\', { timeout: 10000 })']).on('exit', function () {
            done();
        });
    });

    it(getTestIdentifier() + 'should clear internal timeout on fetch error', function (done) {
        this.timeout(2000);
        spawn('node', ['-e', 'require(\'./\')(\'' + base + 'error/reset\', { timeout: 10000 })']).on('exit', function () {
            done();
        });
    });

    it(getTestIdentifier() + 'should set default User-Agent', function () {
        var url = base + 'inspect';
        (0, _src2.default)(url).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['user-agent']).to.startWith('node-fetch/');
        });
    });

    it(getTestIdentifier() + 'should allow setting User-Agent', function () {
        var url = base + 'inspect';
        var opts = {
            headers: {
                'user-agent': 'faked'
            }
        };
        (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['user-agent']).to.equal('faked');
        });
    });

    it(getTestIdentifier() + 'should set default Accept header', function () {
        var url = base + 'inspect';
        (0, _src2.default)(url).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers.accept).to.equal('*/*');
        });
    });

    it(getTestIdentifier() + 'should allow setting Accept header', function () {
        var url = base + 'inspect';
        var opts = {
            headers: {
                'accept': 'application/json'
            }
        };
        (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers.accept).to.equal('application/json');
        });
    });

    it(getTestIdentifier() + 'should allow POST request', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.be.undefined;
            expect(res.headers['content-length']).to.equal('0');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with string body', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.equal('text/plain;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('3');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with buffer body', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: Buffer.from('a=1', 'utf-8')
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.be.undefined;
            expect(res.headers['content-length']).to.equal('3');
        });
    });
// 71
    it(getTestIdentifier() + 'should allow POST request with ArrayBuffer body', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: (0, _stringToArraybuffer2.default)('Hello, world!\n')
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('Hello, world!\n');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.be.undefined;
            expect(res.headers['content-length']).to.equal('14');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with blob body without type', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: new _blob2.default(['a=1'])
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.be.undefined;
            expect(res.headers['content-length']).to.equal('3');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with blob body with type', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: new _blob2.default(['a=1'], {
                type: 'text/plain;charset=UTF-8'
            })
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.equal('text/plain;charset=utf-8');
            expect(res.headers['content-length']).to.equal('3');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with readable stream as body', function () {
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());

        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: body
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.equal('chunked');
            expect(res.headers['content-type']).to.be.undefined;
            expect(res.headers['content-length']).to.be.undefined;
        });
    });

    it(getTestIdentifier() + 'should allow POST request with form-data as body', function () {
        var form = new _formData2.default();
        form.append('a', '1');

        var url = base + 'multipart';
        var opts = {
            method: 'POST',
            body: form
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.startWith('multipart/form-data;boundary=');
            expect(res.headers['content-length']).to.be.a('string');
            expect(res.body).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with form-data using stream as body', function () {
        var form = new _formData2.default();
        form.append('my_field', fs.createReadStream(path.join(__dirname, 'dummy.txt')));

        var url = base + 'multipart';
        var opts = {
            method: 'POST',
            body: form
        };

        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.startWith('multipart/form-data;boundary=');
            expect(res.headers['content-length']).to.be.undefined;
            expect(res.body).to.contain('my_field=');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with form-data as body and custom headers', function () {
        var form = new _formData2.default();
        form.append('a', '1');

        var headers = form.getHeaders();
        headers['b'] = '2';

        var url = base + 'multipart';
        var opts = {
            method: 'POST',
            body: form,
            headers: headers
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.startWith('multipart/form-data; boundary=');
            expect(res.headers['content-length']).to.be.a('string');
            expect(res.headers.b).to.equal('2');
            expect(res.body).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should allow POST request with object body', function () {
        var url = base + 'inspect';
        // note that fetch simply calls tostring on an object
        var opts = {
            method: 'POST',
            body: { a: 1 }
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('[object Object]');
            expect(res.headers['content-type']).to.equal('text/plain;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('15');
        });
    });

    var itUSP = typeof URLSearchParams === 'function' ? it : it.skip;
    itUSP(getTestIdentifier() + 'should allow POST request with URLSearchParams as body', function () {
        var params = new URLSearchParams();
        params.append('a', '1');

        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: params
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.equal('application/x-www-form-urlencoded;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('3');
            expect(res.body).to.equal('a=1');
        });
    });

    itUSP(getTestIdentifier() + 'should still recognize URLSearchParams when extended', function () {
        var CustomSearchParams = function (_URLSearchParams) {
            _inherits(CustomSearchParams, _URLSearchParams);

            function CustomSearchParams() {
                _classCallCheck(this, CustomSearchParams);

                return _possibleConstructorReturn(this, (CustomSearchParams.__proto__ || Object.getPrototypeOf(CustomSearchParams)).apply(this, arguments));
            }

            return CustomSearchParams;
        }(URLSearchParams);

        var params = new CustomSearchParams();
        params.append('a', '1');

        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: params
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.equal('application/x-www-form-urlencoded;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('3');
            expect(res.body).to.equal('a=1');
        });
    });
// 81
    /* for 100% code coverage, checks for duck-typing-only detection
  * where both constructor.name and brand tests fail */
    it(getTestIdentifier() + 'should still recognize URLSearchParams when extended from polyfill', function () {
        var CustomPolyfilledSearchParams = function (_URLSearchParams_Poly) {
            _inherits(CustomPolyfilledSearchParams, _URLSearchParams_Poly);

            function CustomPolyfilledSearchParams() {
                _classCallCheck(this, CustomPolyfilledSearchParams);

                return _possibleConstructorReturn(this, (CustomPolyfilledSearchParams.__proto__ || Object.getPrototypeOf(CustomPolyfilledSearchParams)).apply(this, arguments));
            }

            return CustomPolyfilledSearchParams;
        }(_urlSearchParams2.default);

        var params = new CustomPolyfilledSearchParams();
        params.append('a', '1');

        var url = base + 'inspect';
        var opts = {
            method: 'POST',
            body: params
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.headers['content-type']).to.equal('application/x-www-form-urlencoded;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('3');
            expect(res.body).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should overwrite Content-Length if possible', function () {
        var url = base + 'inspect';
        // note that fetch simply calls tostring on an object
        var opts = {
            method: 'POST',
            headers: {
                'Content-Length': '1000'
            },
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('POST');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-type']).to.equal('text/plain;charset=UTF-8');
            expect(res.headers['content-length']).to.equal('3');
        });
    });

    it(getTestIdentifier() + 'should allow PUT request', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'PUT',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('PUT');
            expect(res.body).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should allow DELETE request', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'DELETE'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('DELETE');
        });
    });

    it(getTestIdentifier() + 'should allow DELETE request with string body', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'DELETE',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('DELETE');
            expect(res.body).to.equal('a=1');
            expect(res.headers['transfer-encoding']).to.be.undefined;
            expect(res.headers['content-length']).to.equal('3');
        });
    });

    it(getTestIdentifier() + 'should allow PATCH request', function () {
        var url = base + 'inspect';
        var opts = {
            method: 'PATCH',
            body: 'a=1'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.method).to.equal('PATCH');
            expect(res.body).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should allow HEAD request', function () {
        var url = base + 'hello';
        var opts = {
            method: 'HEAD'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(200);
            expect(res.statusText).to.equal('OK');
            expect(res.headers.get('content-type')).to.equal('text/plain');
            expect(res.body).to.be.an.instanceof(stream.Transform);
            return res.text();
        }).then(function (text) {
            expect(text).to.equal('');
        });
    });

    it(getTestIdentifier() + 'should allow HEAD request with content-encoding header', function () {
        var url = base + 'error/404';
        var opts = {
            method: 'HEAD'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(404);
            expect(res.headers.get('content-encoding')).to.equal('gzip');
            return res.text();
        }).then(function (text) {
            expect(text).to.equal('');
        });
    });

    it(getTestIdentifier() + 'should allow OPTIONS request', function () {
        var url = base + 'options';
        var opts = {
            method: 'OPTIONS'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(200);
            expect(res.statusText).to.equal('OK');
            expect(res.headers.get('allow')).to.equal('GET, HEAD, OPTIONS');
            expect(res.body).to.be.an.instanceof(stream.Transform);
        });
    });

    it(getTestIdentifier() + 'should reject decoding body twice', function () {
        var url = base + 'plain';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return res.text().then(function (result) {
                expect(res.bodyUsed).to.be.true;
                return expect(res.text()).to.eventually.be.rejectedWith(Error);
            });
        });
    });
// 91
    it(getTestIdentifier() + 'should support maximum response size, multiple chunk', function () {
        var url = base + 'size/chunk';
        var opts = {
            size: 5
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(200);
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return expect(res.text()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'max-size');
        });
    });

    it(getTestIdentifier() + 'should support maximum response size, single chunk', function () {
        var url = base + 'size/long';
        var opts = {
            size: 5
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(200);
            expect(res.headers.get('content-type')).to.equal('text/plain');
            return expect(res.text()).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.have.property('type', 'max-size');
        });
    });

    it(getTestIdentifier() + 'should allow piping response body as stream', function () {
        var url = base + 'hello';
        return (0, _src2.default)(url).then(function (res) {
            expect(res.body).to.be.an.instanceof(stream.Transform);
            return streamToPromise(res.body, function (chunk) {
                if (chunk === null) {
                    return;
                }
                expect(chunk.toString()).to.equal('world');
            });
        });
    });

    it(getTestIdentifier() + 'should allow cloning a response, and use both as stream', function () {
        var url = base + 'hello';
        return (0, _src2.default)(url).then(function (res) {
            var r1 = res.clone();
            expect(res.body).to.be.an.instanceof(stream.Transform);
            expect(r1.body).to.be.an.instanceof(stream.Transform);
            var dataHandler = function dataHandler(chunk) {
                if (chunk === null) {
                    return;
                }
                expect(chunk.toString()).to.equal('world');
            };

            return Promise.all([streamToPromise(res.body, dataHandler), streamToPromise(r1.body, dataHandler)]);
        });
    });

    it(getTestIdentifier() + 'should allow cloning a json response and log it as text response', function () {
        var url = base + 'json';
        return (0, _src2.default)(url).then(function (res) {
            var r1 = res.clone();
            return Promise.all([res.json(), r1.text()]).then(function (results) {
                expect(results[0]).to.deep.equal({ name: 'value' });
                expect(results[1]).to.equal('{"name":"value"}');
            });
        });
    });

    it(getTestIdentifier() + 'should allow cloning a json response, and then log it as text response', function () {
        var url = base + 'json';
        return (0, _src2.default)(url).then(function (res) {
            var r1 = res.clone();
            return res.json().then(function (result) {
                expect(result).to.deep.equal({ name: 'value' });
                return r1.text().then(function (result) {
                    expect(result).to.equal('{"name":"value"}');
                });
            });
        });
    });

    it(getTestIdentifier() + 'should allow cloning a json response, first log as text response, then return json object', function () {
        var url = base + 'json';
        return (0, _src2.default)(url).then(function (res) {
            var r1 = res.clone();
            return r1.text().then(function (result) {
                expect(result).to.equal('{"name":"value"}');
                return res.json().then(function (result) {
                    expect(result).to.deep.equal({ name: 'value' });
                });
            });
        });
    });

    it(getTestIdentifier() + 'should not allow cloning a response after its been used', function () {
        var url = base + 'hello';
        return (0, _src2.default)(url).then(function (res) {
            return res.text().then(function (result) {
                expect(function () {
                    res.clone();
                }).to.throw(Error);
            });
        });
    });

    it(getTestIdentifier() + 'should allow get all responses of a header', function () {
        var url = base + 'cookie';
        return (0, _src2.default)(url).then(function (res) {
            var expected = 'a=1, b=1';
            expect(res.headers.get('set-cookie')).to.equal(expected);
            expect(res.headers.get('Set-Cookie')).to.equal(expected);
        });
    });

    it(getTestIdentifier() + 'should return all headers using raw()', function () {
        var url = base + 'cookie';
        return (0, _src2.default)(url).then(function (res) {
            var expected = ['a=1', 'b=1'];

            expect(res.headers.raw()['set-cookie']).to.deep.equal(expected);
        });
    });

    it(getTestIdentifier() + 'should allow deleting header', function () {
        var url = base + 'cookie';
        return (0, _src2.default)(url).then(function (res) {
            res.headers.delete('set-cookie');
            expect(res.headers.get('set-cookie')).to.be.null;
        });
    });

    it(getTestIdentifier() + 'should send request with connection keep-alive if agent is provided', function () {
        var url = base + 'inspect';
        var opts = {
            agent: new http.Agent({
                keepAlive: true
            })
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            return res.json();
        }).then(function (res) {
            expect(res.headers['connection']).to.equal('keep-alive');
        });
    });

    it(getTestIdentifier() + 'should support fetch with Request instance', function () {
        var url = base + 'hello';
        var req = new _src.Request(url);
        return (0, _src2.default)(req).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.ok).to.be.true;
            expect(res.status).to.equal(200);
        });
    });

    it(getTestIdentifier() + 'should support fetch with Node.js URL object', function () {
        var url = base + 'hello';
        var urlObj = parseURL(url);
        var req = new _src.Request(urlObj);
        return (0, _src2.default)(req).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.ok).to.be.true;
            expect(res.status).to.equal(200);
        });
    });

    it(getTestIdentifier() + 'should support fetch with WHATWG URL object', function () {
        var url = base + 'hello';
        var urlObj = new _whatwgUrl.URL(url);
        var req = new _src.Request(urlObj);
        return (0, _src2.default)(req).then(function (res) {
            expect(res.url).to.equal(url);
            expect(res.ok).to.be.true;
            expect(res.status).to.equal(200);
        });
    });

    it(getTestIdentifier() + 'should support blob round-trip', function () {
        var url = base + 'hello';

        var length = void 0,
            type = void 0;

        return (0, _src2.default)(url).then(function (res) {
            return res.blob();
        }).then(function (blob) {
            var url = base + 'inspect';
            length = blob.size;
            type = blob.type;
            return (0, _src2.default)(url, {
                method: 'POST',
                body: blob
            });
        }).then(function (res) {
            return res.json();
        }).then(function (_ref) {
            var body = _ref.body,
                headers = _ref.headers;

            expect(body).to.equal('world');
            expect(headers['content-type']).to.equal(type);
            expect(headers['content-length']).to.equal(String(length));
        });
    });

    it(getTestIdentifier() + 'should support overwrite Request instance', function () {
        var url = base + 'inspect';
        var req = new _src.Request(url, {
            method: 'POST',
            headers: {
                a: '1'
            }
        });
        return (0, _src2.default)(req, {
            method: 'GET',
            headers: {
                a: '2'
            }
        }).then(function (res) {
            return res.json();
        }).then(function (body) {
            expect(body.method).to.equal('GET');
            expect(body.headers.a).to.equal('2');
        });
    });

    it(getTestIdentifier() + 'should support arrayBuffer(), blob(), text(), json() and buffer() method in Body constructor', function () {
        var body = new _body2.default('a=1');
        expect(body).to.have.property('arrayBuffer');
        expect(body).to.have.property('blob');
        expect(body).to.have.property('text');
        expect(body).to.have.property('json');
        expect(body).to.have.property('buffer');
    });

    it(getTestIdentifier() + 'should create custom FetchError', function funcName() {
        var systemError = new Error('system');
        systemError.code = 'ESOMEERROR';

        var err = new _src.FetchError('test message', 'test-error', systemError);
        expect(err).to.be.an.instanceof(Error);
        expect(err).to.be.an.instanceof(_src.FetchError);
        expect(err.name).to.equal('FetchError');
        expect(err.message).to.equal('test message');
        expect(err.type).to.equal('test-error');
        expect(err.code).to.equal('ESOMEERROR');
        expect(err.errno).to.equal('ESOMEERROR');
        expect(err.stack).to.include('funcName').and.to.startWith(err.name + ': ' + err.message);
    });

    it(getTestIdentifier() + 'should support https request', function () {
        this.timeout(5000);
        var url = 'https://github.com/';
        var opts = {
            method: 'HEAD'
        };
        return (0, _src2.default)(url, opts).then(function (res) {
            expect(res.status).to.equal(200);
            expect(res.ok).to.be.true;
        });
    });

    // issue #414
    it(getTestIdentifier() + 'should reject if attempt to accumulate body stream throws', function () {
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());
        var res = new _src.Response(body);
        var bufferConcat = Buffer.concat;
        var restoreBufferConcat = function restoreBufferConcat() {
            return Buffer.concat = bufferConcat;
        };
        Buffer.concat = function () {
            throw new Error('embedded error');
        };

        var textPromise = res.text();
        // Ensure that `Buffer.concat` is always restored:
        textPromise.then(restoreBufferConcat, restoreBufferConcat);

        return expect(textPromise).to.eventually.be.rejected.and.be.an.instanceOf(_src.FetchError).and.include({ type: 'system' }).and.have.property('message').that.includes('Could not create Buffer').and.that.includes('embedded error');
    });
});

describe('Headers', function () {
    it(getTestIdentifier() + 'should have attributes conforming to Web IDL', function () {
        var headers = new _src.Headers();
        expect(Object.getOwnPropertyNames(headers)).to.be.empty;
        var enumerableProperties = [];
        for (var property in headers) {
            enumerableProperties.push(property);
        }
        var _arr = ['append', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];
        for (var _i = 0; _i < _arr.length; _i++) {
            var toCheck = _arr[_i];
            expect(enumerableProperties).to.contain(toCheck);
        }
    });

    it(getTestIdentifier() + 'should allow iterating through all headers with forEach', function () {
        var headers = new _src.Headers([['b', '2'], ['c', '4'], ['b', '3'], ['a', '1']]);
        expect(headers).to.have.property('forEach');

        var result = [];
        headers.forEach(function (val, key) {
            result.push([key, val]);
        });

        expect(result).to.deep.equal([["a", "1"], ["b", "2, 3"], ["c", "4"]]);
    });

    it(getTestIdentifier() + 'should allow iterating through all headers with for-of loop', function () {
        var headers = new _src.Headers([['b', '2'], ['c', '4'], ['a', '1']]);
        headers.append('b', '3');
        expect(headers).to.be.iterable;

        var result = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = headers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pair = _step.value;

                result.push(pair);
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

        expect(result).to.deep.equal([['a', '1'], ['b', '2, 3'], ['c', '4']]);
    });

    it(getTestIdentifier() + 'should allow iterating through all headers with entries()', function () {
        var headers = new _src.Headers([['b', '2'], ['c', '4'], ['a', '1']]);
        headers.append('b', '3');

        expect(headers.entries()).to.be.iterable.and.to.deep.iterate.over([['a', '1'], ['b', '2, 3'], ['c', '4']]);
    });

    it(getTestIdentifier() + 'should allow iterating through all headers with keys()', function () {
        var headers = new _src.Headers([['b', '2'], ['c', '4'], ['a', '1']]);
        headers.append('b', '3');

        expect(headers.keys()).to.be.iterable.and.to.iterate.over(['a', 'b', 'c']);
    });

    it(getTestIdentifier() + 'should allow iterating through all headers with values()', function () {
        var headers = new _src.Headers([['b', '2'], ['c', '4'], ['a', '1']]);
        headers.append('b', '3');

        expect(headers.values()).to.be.iterable.and.to.iterate.over(['1', '2, 3', '4']);
    });

    it(getTestIdentifier() + 'should reject illegal header', function () {
        var headers = new _src.Headers();
        expect(function () {
            return new _src.Headers({ 'He y': 'ok' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Headers({ 'Hé-y': 'ok' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Headers({ 'He-y': 'ăk' });
        }).to.throw(TypeError);
        expect(function () {
            return headers.append('Hé-y', 'ok');
        }).to.throw(TypeError);
        expect(function () {
            return headers.delete('Hé-y');
        }).to.throw(TypeError);
        expect(function () {
            return headers.get('Hé-y');
        }).to.throw(TypeError);
        expect(function () {
            return headers.has('Hé-y');
        }).to.throw(TypeError);
        expect(function () {
            return headers.set('Hé-y', 'ok');
        }).to.throw(TypeError);

        // 'o k' is valid value but invalid name
        new _src.Headers({ 'He-y': 'o k' });
    });

    it(getTestIdentifier() + 'should ignore unsupported attributes while reading headers', function () {
        var FakeHeader = function FakeHeader() {};
        // prototypes are currently ignored
        // This might change in the future: #181
        FakeHeader.prototype.z = 'fake';

        var res = new FakeHeader();
        res.a = 'string';
        res.b = ['1', '2'];
        res.c = '';
        res.d = [];
        res.e = 1;
        res.f = [1, 2];
        res.g = { a: 1 };
        res.h = undefined;
        res.i = null;
        res.j = NaN;
        res.k = true;
        res.l = false;
        res.m = Buffer.from('test');

        var h1 = new _src.Headers(res);
        h1.set('n', [1, 2]);
        h1.append('n', ['3', 4]);

        var h1Raw = h1.raw();

        expect(h1Raw['a']).to.include('string');
        expect(h1Raw['b']).to.include('1,2');
        expect(h1Raw['c']).to.include('');
        expect(h1Raw['d']).to.include('');
        expect(h1Raw['e']).to.include('1');
        expect(h1Raw['f']).to.include('1,2');
        expect(h1Raw['g']).to.include('[object Object]');
        expect(h1Raw['h']).to.include('undefined');
        expect(h1Raw['i']).to.include('null');
        expect(h1Raw['j']).to.include('NaN');
        expect(h1Raw['k']).to.include('true');
        expect(h1Raw['l']).to.include('false');
        expect(h1Raw['m']).to.include('test');
        expect(h1Raw['n']).to.include('1,2');
        expect(h1Raw['n']).to.include('3,4');

        expect(h1Raw['z']).to.be.undefined;
    });

    it(getTestIdentifier() + 'should wrap headers', function () {
        var h1 = new _src.Headers({
            a: '1'
        });
        var h1Raw = h1.raw();

        var h2 = new _src.Headers(h1);
        h2.set('b', '1');
        var h2Raw = h2.raw();

        var h3 = new _src.Headers(h2);
        h3.append('a', '2');
        var h3Raw = h3.raw();

        expect(h1Raw['a']).to.include('1');
        expect(h1Raw['a']).to.not.include('2');

        expect(h2Raw['a']).to.include('1');
        expect(h2Raw['a']).to.not.include('2');
        expect(h2Raw['b']).to.include('1');

        expect(h3Raw['a']).to.include('1');
        expect(h3Raw['a']).to.include('2');
        expect(h3Raw['b']).to.include('1');
    });

    it(getTestIdentifier() + 'should accept headers as an iterable of tuples', function () {
        var headers = void 0;

        headers = new _src.Headers([['a', '1'], ['b', '2'], ['a', '3']]);
        expect(headers.get('a')).to.equal('1, 3');
        expect(headers.get('b')).to.equal('2');

        headers = new _src.Headers([new Set(['a', '1']), ['b', '2'], new Map([['a', null], ['3', null]]).keys()]);
        expect(headers.get('a')).to.equal('1, 3');
        expect(headers.get('b')).to.equal('2');

        headers = new _src.Headers(new Map([['a', '1'], ['b', '2']]));
        expect(headers.get('a')).to.equal('1');
        expect(headers.get('b')).to.equal('2');
    });

    it(getTestIdentifier() + 'should throw a TypeError if non-tuple exists in a headers initializer', function () {
        expect(function () {
            return new _src.Headers([['b', '2', 'huh?']]);
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Headers(['b2']);
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Headers('b2');
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Headers(_defineProperty({}, Symbol.iterator, 42));
        }).to.throw(TypeError);
    });
});

describe('Response', function () {
    it(getTestIdentifier() + 'should have attributes conforming to Web IDL', function () {
        var res = new _src.Response();
        var enumerableProperties = [];
        for (var property in res) {
            enumerableProperties.push(property);
        }
        var _arr2 = ['body', 'bodyUsed', 'arrayBuffer', 'blob', 'json', 'text', 'url', 'status', 'ok', 'statusText', 'headers', 'clone'];
        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var toCheck = _arr2[_i2];
            expect(enumerableProperties).to.contain(toCheck);
        }
        var _arr3 = ['body', 'bodyUsed', 'url', 'status', 'ok', 'statusText', 'headers'];

        var _loop = function _loop() {
            var toCheck = _arr3[_i3];
            expect(function () {
                res[toCheck] = 'abc';
            }).to.throw();
        };

        for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
            _loop();
        }
    });

    it(getTestIdentifier() + 'should support empty options', function () {
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());
        var res = new _src.Response(body);
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support parsing headers', function () {
        var res = new _src.Response(null, {
            headers: {
                a: '1'
            }
        });
        expect(res.headers.get('a')).to.equal('1');
    });

    it(getTestIdentifier() + 'should support text() method', function () {
        var res = new _src.Response('a=1');
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support json() method', function () {
        var res = new _src.Response('{"a":1}');
        return res.json().then(function (result) {
            expect(result.a).to.equal(1);
        });
    });

    it(getTestIdentifier() + 'should support buffer() method', function () {
        var res = new _src.Response('a=1');
        return res.buffer().then(function (result) {
            expect(result.toString()).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support blob() method', function () {
        var res = new _src.Response('a=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return res.blob().then(function (result) {
            expect(result).to.be.an.instanceOf(_blob2.default);
            expect(result.size).to.equal(3);
            expect(result.type).to.equal('text/plain');
        });
    });

    it(getTestIdentifier() + 'should support clone() method', function () {
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());
        var res = new _src.Response(body, {
            headers: {
                a: '1'
            },
            url: base,
            status: 346,
            statusText: 'production'
        });
        var cl = res.clone();
        expect(cl.headers.get('a')).to.equal('1');
        expect(cl.url).to.equal(base);
        expect(cl.status).to.equal(346);
        expect(cl.statusText).to.equal('production');
        expect(cl.ok).to.be.false;
        // clone body shouldn't be the same body
        expect(cl.body).to.not.equal(body);
        return cl.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support stream as body', function () {
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());
        var res = new _src.Response(body);
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support string as body', function () {
        var res = new _src.Response('a=1');
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support buffer as body', function () {
        var res = new _src.Response(Buffer.from('a=1'));
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support ArrayBuffer as body', function () {
        var res = new _src.Response((0, _stringToArraybuffer2.default)('a=1'));
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support blob as body', function () {
        var res = new _src.Response(new _blob2.default(['a=1']));
        return res.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should default to null as body', function () {
        var res = new _src.Response();
        expect(res.body).to.equal(null);

        return res.text().then(function (result) {
            return expect(result).to.equal('');
        });
    });

    it(getTestIdentifier() + 'should default to 200 as status code', function () {
        var res = new _src.Response(null);
        expect(res.status).to.equal(200);
    });
});

describe('Request', function () {
    it(getTestIdentifier() + 'should have attributes conforming to Web IDL', function () {
        var req = new _src.Request('https://github.com/');
        var enumerableProperties = [];
        for (var property in req) {
            enumerableProperties.push(property);
        }
        var _arr4 = ['body', 'bodyUsed', 'arrayBuffer', 'blob', 'json', 'text', 'method', 'url', 'headers', 'redirect', 'clone'];
        for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
            var toCheck = _arr4[_i4];
            expect(enumerableProperties).to.contain(toCheck);
        }
        var _arr5 = ['body', 'bodyUsed', 'method', 'url', 'headers', 'redirect'];

        var _loop2 = function _loop2() {
            var toCheck = _arr5[_i5];
            expect(function () {
                req[toCheck] = 'abc';
            }).to.throw();
        };

        for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
            _loop2();
        }
    });

    it(getTestIdentifier() + 'should support wrapping Request instance', function () {
        var url = base + 'hello';

        var form = new _formData2.default();
        form.append('a', '1');

        var r1 = new _src.Request(url, {
            method: 'POST',
            follow: 1,
            body: form
        });
        var r2 = new _src.Request(r1, {
            follow: 2
        });

        expect(r2.url).to.equal(url);
        expect(r2.method).to.equal('POST');
        // note that we didn't clone the body
        expect(r2.body).to.equal(form);
        expect(r1.follow).to.equal(1);
        expect(r2.follow).to.equal(2);
        expect(r1.counter).to.equal(0);
        expect(r2.counter).to.equal(0);
    });

    it(getTestIdentifier() + 'should throw error with GET/HEAD requests with body', function () {
        expect(function () {
            return new _src.Request('.', { body: '' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Request('.', { body: 'a' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Request('.', { body: '', method: 'HEAD' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Request('.', { body: 'a', method: 'HEAD' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Request('.', { body: 'a', method: 'get' });
        }).to.throw(TypeError);
        expect(function () {
            return new _src.Request('.', { body: 'a', method: 'head' });
        }).to.throw(TypeError);
    });

    it(getTestIdentifier() + 'should default to null as body', function () {
        var req = new _src.Request('.');
        expect(req.body).to.equal(null);
        return req.text().then(function (result) {
            return expect(result).to.equal('');
        });
    });

    it(getTestIdentifier() + 'should support parsing headers', function () {
        var url = base;
        var req = new _src.Request(url, {
            headers: {
                a: '1'
            }
        });
        expect(req.url).to.equal(url);
        expect(req.headers.get('a')).to.equal('1');
    });

    it(getTestIdentifier() + 'should support arrayBuffer() method', function () {
        var url = base;
        var req = new _src.Request(url, {
            method: 'POST',
            body: 'a=1'
        });
        expect(req.url).to.equal(url);
        return req.arrayBuffer().then(function (result) {
            expect(result).to.be.an.instanceOf(ArrayBuffer);
            var str = String.fromCharCode.apply(null, new Uint8Array(result));
            expect(str).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support text() method', function () {
        var url = base;
        var req = new _src.Request(url, {
            method: 'POST',
            body: 'a=1'
        });
        expect(req.url).to.equal(url);
        return req.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support json() method', function () {
        var url = base;
        var req = new _src.Request(url, {
            method: 'POST',
            body: '{"a":1}'
        });
        expect(req.url).to.equal(url);
        return req.json().then(function (result) {
            expect(result.a).to.equal(1);
        });
    });

    it(getTestIdentifier() + 'should support buffer() method', function () {
        var url = base;
        var req = new _src.Request(url, {
            method: 'POST',
            body: 'a=1'
        });
        expect(req.url).to.equal(url);
        return req.buffer().then(function (result) {
            expect(result.toString()).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support blob() method', function () {
        var url = base;
        var req = new _src.Request(url, {
            method: 'POST',
            body: Buffer.from('a=1')
        });
        expect(req.url).to.equal(url);
        return req.blob().then(function (result) {
            expect(result).to.be.an.instanceOf(_blob2.default);
            expect(result.size).to.equal(3);
            expect(result.type).to.equal('');
        });
    });

    it(getTestIdentifier() + 'should support arbitrary url', function () {
        var url = 'anything';
        var req = new _src.Request(url);
        expect(req.url).to.equal('anything');
    });

    it(getTestIdentifier() + 'should support clone() method', function () {
        var url = base;
        var body = (0, _resumer2.default)().queue('a=1').end();
        body = body.pipe(new stream.PassThrough());
        var agent = new http.Agent();
        var req = new _src.Request(url, {
            body: body,
            method: 'POST',
            redirect: 'manual',
            headers: {
                b: '2'
            },
            follow: 3,
            compress: false,
            agent: agent
        });
        var cl = req.clone();
        expect(cl.url).to.equal(url);
        expect(cl.method).to.equal('POST');
        expect(cl.redirect).to.equal('manual');
        expect(cl.headers.get('b')).to.equal('2');
        expect(cl.follow).to.equal(3);
        expect(cl.compress).to.equal(false);
        expect(cl.method).to.equal('POST');
        expect(cl.counter).to.equal(0);
        expect(cl.agent).to.equal(agent);
        // clone body shouldn't be the same body
        expect(cl.body).to.not.equal(body);
        return Promise.all([cl.text(), req.text()]).then(function (results) {
            expect(results[0]).to.equal('a=1');
            expect(results[1]).to.equal('a=1');
        });
    });

    it(getTestIdentifier() + 'should support ArrayBuffer as body', function () {
        var req = new _src.Request('', {
            method: 'POST',
            body: (0, _stringToArraybuffer2.default)('a=1')
        });
        return req.text().then(function (result) {
            expect(result).to.equal('a=1');
        });
    });
});

function streamToPromise(stream, dataHandler) {
    return new Promise(function (resolve, reject) {
        stream.on('data', function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            Promise.resolve().then(function () {
                return dataHandler.apply(undefined, args);
            }).catch(reject);
        });
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

describe('external encoding', function () {
    var hasEncoding = typeof convert === 'function';

    describe('with optional `encoding`', function () {
        before(function () {
            if (!hasEncoding) this.skip();
        });

        it(getTestIdentifier() + 'should only use UTF-8 decoding with text()', function () {
            var url = base + 'encoding/euc-jp';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.text().then(function (result) {
                    expect(result).to.equal('<?xml version="1.0" encoding="EUC-JP"?><title>\uFFFD\uFFFD\uFFFD\u0738\uFFFD</title>');
                });
            });
        });

        it(getTestIdentifier() + 'should support encoding decode, xml dtd detect', function () {
            var url = base + 'encoding/euc-jp';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('<?xml version="1.0" encoding="EUC-JP"?><title>日本語</title>');
                });
            });
        });

        it(getTestIdentifier() + 'should support encoding decode, content-type detect', function () {
            var url = base + 'encoding/shift-jis';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('<div>日本語</div>');
                });
            });
        });

        it(getTestIdentifier() + 'should support encoding decode, html5 detect', function () {
            var url = base + 'encoding/gbk';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('<meta charset="gbk"><div>中文</div>');
                });
            });
        });

        it(getTestIdentifier() + 'should support encoding decode, html4 detect', function () {
            var url = base + 'encoding/gb2312';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('<meta http-equiv="Content-Type" content="text/html; charset=gb2312"><div>中文</div>');
                });
            });
        });

        it(getTestIdentifier() + 'should default to utf8 encoding', function () {
            var url = base + 'encoding/utf8';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                expect(res.headers.get('content-type')).to.be.null;
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('中文');
                });
            });
        });

        it(getTestIdentifier() + 'should support uncommon content-type order, charset in front', function () {
            var url = base + 'encoding/order1';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('中文');
                });
            });
        });

        it(getTestIdentifier() + 'should support uncommon content-type order, end with qs', function () {
            var url = base + 'encoding/order2';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal('中文');
                });
            });
        });

        it(getTestIdentifier() + 'should support chunked encoding, html4 detect', function () {
            var url = base + 'encoding/chunked';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                var padding = 'a'.repeat(10);
                return res.textConverted().then(function (result) {
                    expect(result).to.equal(padding + '<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS" /><div>\u65E5\u672C\u8A9E</div>');
                });
            });
        });

        it(getTestIdentifier() + 'should only do encoding detection up to 1024 bytes', function () {
            var url = base + 'encoding/invalid';
            return (0, _src2.default)(url).then(function (res) {
                expect(res.status).to.equal(200);
                var padding = 'a'.repeat(1200);
                return res.textConverted().then(function (result) {
                    expect(result).to.not.equal(padding + '\u4E2D\u6587');
                });
            });
        });
    });

    describe('without optional `encoding`', function () {
        before(function () {
            if (hasEncoding) this.skip();
        });

        it(getTestIdentifier() + 'should throw a FetchError if res.textConverted() is called without `encoding` in require cache', function () {
            var url = base + 'hello';
            return (0, _src2.default)(url).then(function (res) {
                return expect(res.textConverted()).to.eventually.be.rejected.and.have.property('message').which.includes('encoding');
            });
        });
    });
});
// 'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _url = require('url');

var _zlib = require('zlib');

var zlib = _interopRequireWildcard(_zlib);

var _stream = require('stream');

var stream = _interopRequireWildcard(_stream);

var _parted = require('parted');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var convert = void 0;
try {
    convert = require('encoding').convert;
} catch (e) {}

var TestServer = function () {
    function TestServer() {
        _classCallCheck(this, TestServer);

        this.server = http.createServer(this.router);
        this.port = 30001;
        this.hostname = 'localhost';
        // node 8 default keepalive timeout is 5000ms
        // make it shorter here as we want to close server quickly at the end of tests
        this.server.keepAliveTimeout = 1000;
        this.server.on('error', function (err) {
            console.log(err.stack);
        });
        this.server.on('connection', function (socket) {
            socket.setTimeout(1500);
        });
    }

    _createClass(TestServer, [{
        key: 'start',
        value: function start(cb) {
            this.server.listen(this.port, this.hostname, cb);
        }
    }, {
        key: 'stop',
        value: function stop(cb) {
            this.server.close(cb);
        }
    }, {
        key: 'router',
        value: function router(req, res) {
            var p = (0, _url.parse)(req.url).pathname;

            if (p === '/hello') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('world');
            }

            if (p === '/plain') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('text');
            }

            if (p === '/options') {
                res.statusCode = 200;
                res.setHeader('Allow', 'GET, HEAD, OPTIONS');
                res.end('hello world');
            }

            if (p === '/html') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end('<html></html>');
            }

            if (p === '/json') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    name: 'value'
                }));
            }

            if (p === '/gzip') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'gzip');
                zlib.gzip('hello world', function (err, buffer) {
                    res.end(buffer);
                });
            }

            if (p === '/gzip-truncated') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'gzip');
                zlib.gzip('hello world', function (err, buffer) {
                    // truncate the CRC checksum and size check at the end of the stream
                    res.end(buffer.slice(0, buffer.length - 8));
                });
            }

            if (p === '/deflate') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'deflate');
                zlib.deflate('hello world', function (err, buffer) {
                    res.end(buffer);
                });
            }

            if (p === '/deflate-raw') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'deflate');
                zlib.deflateRaw('hello world', function (err, buffer) {
                    res.end(buffer);
                });
            }

            if (p === '/sdch') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'sdch');
                res.end('fake sdch string');
            }

            if (p === '/invalid-content-encoding') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Encoding', 'gzip');
                res.end('fake gzip string');
            }

            if (p === '/invalid-header') {
                res.setHeader('Content-Type', 'text/plain');
                res.writeHead(200);
                // HACK: add a few invalid headers to the generated header string before
                // it is actually sent to the socket.
                res._header = res._header.replace(/\r\n$/, ['Invalid-Header : abc\r\n', 'Invalid-Header-Value: \x07k\r\n', 'Set-Cookie: \x07k\r\n', 'Set-Cookie: \x07kk\r\n'].join('') + '\r\n');
                res.end('hello world\n');
            }

            if (p === '/timeout') {
                setTimeout(function () {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('text');
                }, 1000);
            }

            if (p === '/slow') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.write('test');
                setTimeout(function () {
                    res.end('test');
                }, 1000);
            }

            if (p === '/cookie') {
                res.statusCode = 200;
                res.setHeader('Set-Cookie', ['a=1', 'b=1']);
                res.end('cookie');
            }

            if (p === '/size/chunk') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                setTimeout(function () {
                    res.write('test');
                }, 50);
                setTimeout(function () {
                    res.end('test');
                }, 100);
            }

            if (p === '/size/long') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('testtest');
            }

            if (p === '/encoding/gbk') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(convert('<meta charset="gbk"><div>中文</div>', 'gbk'));
            }

            if (p === '/encoding/gb2312') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(convert('<meta http-equiv="Content-Type" content="text/html; charset=gb2312"><div>中文</div>', 'gb2312'));
            }

            if (p === '/encoding/shift-jis') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=Shift-JIS');
                res.end(convert('<div>日本語</div>', 'Shift_JIS'));
            }

            if (p === '/encoding/euc-jp') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/xml');
                res.end(convert('<?xml version="1.0" encoding="EUC-JP"?><title>日本語</title>', 'EUC-JP'));
            }

            if (p === '/encoding/utf8') {
                res.statusCode = 200;
                res.end('中文');
            }

            if (p === '/encoding/order1') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'charset=gbk; text/plain');
                res.end(convert('中文', 'gbk'));
            }

            if (p === '/encoding/order2') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain; charset=gbk; qs=1');
                res.end(convert('中文', 'gbk'));
            }

            if (p === '/encoding/chunked') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Transfer-Encoding', 'chunked');
                res.write('a'.repeat(10));
                res.end(convert('<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS" /><div>日本語</div>', 'Shift_JIS'));
            }

            if (p === '/encoding/invalid') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Transfer-Encoding', 'chunked');
                res.write('a'.repeat(1200));
                res.end(convert('中文', 'gbk'));
            }

            if (p === '/redirect/301') {
                res.statusCode = 301;
                res.setHeader('Location', '/inspect');
                res.end();
            }

            if (p === '/redirect/302') {
                res.statusCode = 302;
                res.setHeader('Location', '/inspect');
                res.end();
            }

            if (p === '/redirect/303') {
                res.statusCode = 303;
                res.setHeader('Location', '/inspect');
                res.end();
            }

            if (p === '/redirect/307') {
                res.statusCode = 307;
                res.setHeader('Location', '/inspect');
                res.end();
            }

            if (p === '/redirect/308') {
                res.statusCode = 308;
                res.setHeader('Location', '/inspect');
                res.end();
            }

            if (p === '/redirect/chain') {
                res.statusCode = 301;
                res.setHeader('Location', '/redirect/301');
                res.end();
            }

            if (p === '/redirect/no-location') {
                res.statusCode = 301;
                res.end();
            }

            if (p === '/error/400') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('client error');
            }

            if (p === '/error/404') {
                res.statusCode = 404;
                res.setHeader('Content-Encoding', 'gzip');
                res.end();
            }

            if (p === '/error/500') {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('server error');
            }

            if (p === '/error/reset') {
                res.destroy();
            }

            if (p === '/error/json') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end('invalid json');
            }

            if (p === '/no-content') {
                res.statusCode = 204;
                res.end();
            }

            if (p === '/no-content/gzip') {
                res.statusCode = 204;
                res.setHeader('Content-Encoding', 'gzip');
                res.end();
            }

            if (p === '/not-modified') {
                res.statusCode = 304;
                res.end();
            }

            if (p === '/not-modified/gzip') {
                res.statusCode = 304;
                res.setHeader('Content-Encoding', 'gzip');
                res.end();
            }

            if (p === '/inspect') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var body = '';
                req.on('data', function (c) {
                    body += c;
                });
                req.on('end', function () {
                    res.end(JSON.stringify({
                        method: req.method,
                        url: req.url,
                        headers: req.headers,
                        body: body
                    }));
                });
            }

            if (p === '/multipart') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var parser = new _parted.multipart(req.headers['content-type']);
                var _body = '';
                parser.on('part', function (field, part) {
                    _body += field + '=' + part;
                });
                parser.on('end', function () {
                    res.end(JSON.stringify({
                        method: req.method,
                        url: req.url,
                        headers: req.headers,
                        body: _body
                    }));
                });
                req.pipe(parser);
            }
        }
    }]);

    return TestServer;
}();

exports.default = TestServer;


if (require.main === module) {
    var server = new TestServer();
    server.start(function () {
        console.log('Server started listening at port ' + server.port);
    });
}
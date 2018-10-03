'use strict';

// customized for this use-case

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isObject = function isObject(x) {
	return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null && !(x instanceof RegExp) && !(x instanceof Error) && !(x instanceof Date);
};

module.exports = function mapObj(obj, fn, opts, seen) {
	opts = Object.assign({
		deep: false,
		target: {}
	}, opts);

	seen = seen || new WeakMap();

	if (seen.has(obj)) {
		return seen.get(obj);
	}

	seen.set(obj, opts.target);

	var target = opts.target;
	delete opts.target;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			var val = obj[key];
			var res = fn(key, val, obj);
			var newVal = res[1];

			if (opts.deep && isObject(newVal)) {
				if (Array.isArray(newVal)) {
					newVal = newVal.map(function (x) {
						return isObject(x) ? mapObj(x, fn, opts, seen) : x;
					});
				} else {
					newVal = mapObj(newVal, fn, opts, seen);
				}
			}

			target[res[0]] = newVal;
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

	return target;
};
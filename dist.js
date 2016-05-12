(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

var listeners = {};

function component(componentName, component) {

	var vm = window.manila.data[componentName] || {},
	    el = document.querySelector('[data-component="' + componentName + '"]');

	compile('#' + componentName + '-template').then(function (render) {

		function resolve(data) {

			var index = 0;

			window.manila.handlers[componentName] = [];

			data.on = function (event, handler) {
				for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					args[_key - 2] = arguments[_key];
				}

				var eventString = void 0;

				window.manila.handlers[componentName][index] = function (e) {

					e.stopPropagation();

					args.push(e);

					handler.apply(data, args);

					resolve(data);
				};

				eventString = 'on' + event + '=manila.handlers.' + componentName + '[' + index + '](event)';

				index++;

				return eventString;
			};

			el.innerHTML = render(data);
		}

		vm.render = function () {

			resolve(vm);
		};

		var listener = component(vm);

		listeners[componentName] = function () {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			listener.apply(vm, args);

			resolve(vm);
		};

		resolve(vm);
	});
}

function notify(componentName) {
	for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
		args[_key3 - 1] = arguments[_key3];
	}

	listeners[componentName].apply(undefined, args);
}

window.manila.component = component;
window.manila.notify = notify;

module.exports = {
	component: component,
	notify: notify
};

},{"./compile":2}],2:[function(require,module,exports){
'use strict';

var manila = require('manila/parse');

var cache = {},
    escapeMap = {
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&apos;'
};

function htmlEscape(str) {

	return str.replace(/[&<>'"]/g, function (c) {

		return escapeMap[c];
	});
}

window.manila = window.manila || {};

window.manila.e = function (val) {

	return typeof val === 'string' ? htmlEscape(val) : val;
};

module.exports = function compile(selector) {

	return new Promise(function (resolve) {

		if (!selector) {

			resolve(function () {});
		} else {

			if (cache[selector]) {

				resolve(cache[selector]);
			}

			cache[selector] = manila(document.querySelector(selector).innerHTML);

			resolve(cache[selector]);
		}
	});
};

},{"manila/parse":3}],3:[function(require,module,exports){
'use strict';

module.exports = function(template) {

    return new Function('context',

        "var p=[];with(context){p.push(`" +
       
        template
            .replace(/\\'/g, "\\\\'")
            .replace(/`/g, "\\`")
            .replace(/<--(?!\s*}.*?-->)(?!.*{\s*-->)(.*?)-->/g, "`);try{p.push($1)}catch(e){}p.push(`")
            .replace(/<--\s*(.*?)\s*-->/g, "`);$1\np.push(`")
            .replace(/<-(?!\s*}.*?->)(?!.*{\s*->)(.*?)->/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`")
            .replace(/<-\s*(.*?)\s*->/g, "`);$1\np.push(`")

      + "`);}return p.join('');");
};
},{}]},{},[1]);

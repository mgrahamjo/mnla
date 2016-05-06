(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

function resolvePromise(resolve, promise) {

	if (promise && typeof promise.then === 'function') {

		promise.then(function (data) {

			resolve(data);
		});
	}
}

window.manila.component = function (modules) {

	[].concat(_toConsumableArray(document.querySelectorAll('[data-component]'))).forEach(function (el) {

		var componentName = el.getAttribute('data-component'),
		    component = modules[componentName];

		compile(el.getAttribute('data-template')).then(function (render) {

			function resolve() {
				var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


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

						resolvePromise(resolve, handler.apply(data, args));
					};

					eventString = 'on' + event + '=manila.handlers.' + componentName + '[' + index + '](event)';

					index++;

					return eventString;
				};

				var tagName = el.tagName.toLowerCase();

				if (tagName === 'input' || tagName === 'textarea') {

					el.value = render(data);
				} else {

					el.innerHTML = render(data);
				}
			}

			component.notify = function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				if (typeof component.listen === 'function') {

					resolvePromise(resolve, component.listen.apply(component, [].concat(args)));
				}
			};

			if (typeof component.init === 'function') {

				resolvePromise(resolve, component.init());
			} else if (window.manila.json[componentName]) {

				resolve(JSON.parse(window.manila.json)[componentName]);
			}
		});
	});
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC5qcyIsImNvbXBpbGUuanMiLCJub2RlX21vZHVsZXMvbWFuaWxhL3BhcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLElBQU0sVUFBVSxRQUFRLFdBQVIsQ0FBaEI7O0FBRUEsT0FBTyxNQUFQLEdBQWdCLE9BQU8sTUFBUCxJQUFpQixFQUFqQzs7QUFFQSxPQUFPLE1BQVAsQ0FBYyxRQUFkLEdBQXlCLEVBQXpCOztBQUVBLFNBQVMsY0FBVCxDQUF3QixPQUF4QixFQUFpQyxPQUFqQyxFQUEwQzs7QUFFekMsS0FBSSxXQUFXLE9BQU8sUUFBUSxJQUFmLEtBQXdCLFVBQXZDLEVBQW1EOztBQUVsRCxVQUFRLElBQVIsQ0FBYSxnQkFBUTs7QUFFcEIsV0FBUSxJQUFSO0FBRUEsR0FKRDtBQU1BO0FBRUQ7O0FBRUQsT0FBTyxNQUFQLENBQWMsU0FBZCxHQUEwQixVQUFVLE9BQVYsRUFBbUI7O0FBRTVDLDhCQUFJLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQUosR0FBbUQsT0FBbkQsQ0FBMkQsY0FBTTs7QUFFaEUsTUFBSSxnQkFBZ0IsR0FBRyxZQUFILENBQWdCLGdCQUFoQixDQUFwQjtNQUVDLFlBQVksUUFBUSxhQUFSLENBRmI7O0FBSUEsVUFBUyxHQUFHLFlBQUgsQ0FBZ0IsZUFBaEIsQ0FBVCxFQUE0QyxJQUE1QyxDQUFpRCxrQkFBVTs7QUFFMUQsWUFBUyxPQUFULEdBQTRCO0FBQUEsUUFBWCxJQUFXLHlEQUFKLEVBQUk7OztBQUUzQixRQUFJLFFBQVEsQ0FBWjs7QUFFQSxXQUFPLE1BQVAsQ0FBYyxRQUFkLENBQXVCLGFBQXZCLElBQXdDLEVBQXhDOztBQUVBLFNBQUssRUFBTCxHQUFVLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBNkI7QUFBQSx1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ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IGNvbXBpbGUgPSByZXF1aXJlKCcuL2NvbXBpbGUnKTtcblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuaGFuZGxlcnMgPSB7fTtcblxuZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UocmVzb2x2ZSwgcHJvbWlzZSkge1xuXG5cdGlmIChwcm9taXNlICYmIHR5cGVvZiBwcm9taXNlLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdHByb21pc2UudGhlbihkYXRhID0+IHtcblxuXHRcdFx0cmVzb2x2ZShkYXRhKTtcblx0XHRcdFxuXHRcdH0pO1xuXG5cdH1cblxufVxuXG53aW5kb3cubWFuaWxhLmNvbXBvbmVudCA9IGZ1bmN0aW9uIChtb2R1bGVzKSB7XG5cblx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudF0nKV0uZm9yRWFjaChlbCA9PiB7XG5cblx0XHRsZXQgY29tcG9uZW50TmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSxcblxuXHRcdFx0Y29tcG9uZW50ID0gbW9kdWxlc1tjb21wb25lbnROYW1lXTtcblx0XHRcblx0XHRjb21waWxlKCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKSApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZShkYXRhID0ge30pIHtcblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHRcdHdpbmRvdy5tYW5pbGEuaGFuZGxlcnNbY29tcG9uZW50TmFtZV0gPSBbXTtcblxuXHRcdFx0XHRkYXRhLm9uID0gKGV2ZW50LCBoYW5kbGVyLCAuLi5hcmdzKSA9PiB7XG5cblx0XHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdW2luZGV4XSA9IGUgPT4ge1xuXG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRhcmdzLnB1c2goZSk7XG5cblx0XHRcdFx0XHRcdHJlc29sdmVQcm9taXNlKHJlc29sdmUsIGhhbmRsZXIuYXBwbHkoZGF0YSwgYXJncykpO1xuXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cblx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGV2ZW50U3RyaW5nO1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bGV0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0aWYgKHRhZ05hbWUgPT09ICdpbnB1dCcgfHwgdGFnTmFtZSA9PT0gJ3RleHRhcmVhJykge1xuXG5cdFx0XHRcdFx0ZWwudmFsdWUgPSByZW5kZXIoZGF0YSk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0Y29tcG9uZW50Lm5vdGlmeSA9ICguLi5hcmdzKSA9PiB7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjb21wb25lbnQubGlzdGVuID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlUHJvbWlzZShyZXNvbHZlLCBjb21wb25lbnQubGlzdGVuLmFwcGx5KGNvbXBvbmVudCwgWy4uLmFyZ3NdKSlcblxuXHRcdFx0XHR9XG5cblx0XHRcdH07XG5cblx0XHRcdGlmICh0eXBlb2YgY29tcG9uZW50LmluaXQgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0XHRyZXNvbHZlUHJvbWlzZShyZXNvbHZlLCBjb21wb25lbnQuaW5pdCgpKTtcblxuXHRcdFx0fSBlbHNlIGlmICh3aW5kb3cubWFuaWxhLmpzb25bY29tcG9uZW50TmFtZV0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKEpTT04ucGFyc2Uod2luZG93Lm1hbmlsYS5qc29uKVtjb21wb25lbnROYW1lXSk7XG5cblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdH0pO1xuXG59OyIsImNvbnN0IG1hbmlsYSA9IHJlcXVpcmUoJ21hbmlsYS9wYXJzZScpO1xuXG5sZXQgY2FjaGUgPSB7fSxcblxuXHRlc2NhcGVNYXAgPSB7XG4gICAgICAgICc8JzogJyZsdDsnLFxuICAgICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICdcXCcnOiAnJmFwb3M7J1xuICAgIH07XG5cbmZ1bmN0aW9uIGh0bWxFc2NhcGUoc3RyKSB7XG5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1smPD4nXCJdL2csIGMgPT4ge1xuXG4gICAgICAgIHJldHVybiBlc2NhcGVNYXBbY107XG5cbiAgICB9KTtcblxufVxuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5lID0gZnVuY3Rpb24odmFsKSB7XG5cbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBodG1sRXNjYXBlKHZhbCkgOiB2YWw7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUoc2VsZWN0b3IpIHtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cblx0XHRpZiAoIXNlbGVjdG9yKSB7XG5cblx0XHRcdHJlc29sdmUoICgpPT57fSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGNhY2hlW3NlbGVjdG9yXSkge1xuXG5cdFx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRjYWNoZVtzZWxlY3Rvcl0gPSBtYW5pbGEoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MKTtcblxuXHRcdFx0cmVzb2x2ZShjYWNoZVtzZWxlY3Rvcl0pO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdjb250ZXh0JyxcblxuICAgICAgICBcInZhciBwPVtdO3dpdGgoY29udGV4dCl7cC5wdXNoKGBcIiArXG4gICAgICAgXG4gICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCcvZywgXCJcXFxcXFxcXCdcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9gL2csIFwiXFxcXGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88LS0oPyFcXHMqfS4qPy0tPikoPyEuKntcXHMqLS0+KSguKj8pLS0+L2csIFwiYCk7dHJ5e3AucHVzaCgkMSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC0tXFxzKiguKj8pXFxzKi0tPi9nLCBcImApOyQxXFxucC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88LSg/IVxccyp9Lio/LT4pKD8hLip7XFxzKi0+KSguKj8pLT4vZywgXCJgKTt0cnl7cC5wdXNoKG1hbmlsYS5lKCQxKSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC1cXHMqKC4qPylcXHMqLT4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG5cbiAgICAgICsgXCJgKTt9cmV0dXJuIHAuam9pbignJyk7XCIpO1xufTsiXX0=

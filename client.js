const compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

let components = {},
	
	selection;

function component(componentName, component) {

	let vm = window.manila.data[componentName] || {},

		el = document.querySelector(`[data-component="${componentName}"]`);

	compile(`#${componentName}-template`).then(render => {

		function resolve(data) {

			let index = 0;

			window.manila.handlers[componentName] = [];

			data.on = (event, handler, ...args) => {

				let eventString;

				window.manila.handlers[componentName][index] = e => {

					e.stopPropagation();
					
					args.push(e);

					handler.apply(data, args);

					if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
						
						resolve(data);

					}

				};

				eventString = `on${event}=manila.handlers.${componentName}[${index}](event)`;

				index++;

				return eventString;

			};

			el.innerHTML = render(data);

		}

		vm.render = () => {

			resolve(vm);
			
		};

		let methods = component(vm);

		if (methods) {

			components[componentName] = {};

			Object.keys(methods).forEach(key => {

				components[componentName][key] = (...args) => {

					let result = methods[key].apply(vm, args);

					resolve(vm);

					return result;

				};

			});

		}

		resolve(vm);

	});

	return window.manila;

}

window.manila.component = component;
window.manila.components = components;

module.exports = {
	component: component,
	components: components
};

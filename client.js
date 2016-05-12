const compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

let listeners = {};

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

					resolve(data);

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

		let listener = component(vm);

		listeners[componentName] = (...args) => {
			
			listener.apply(vm, args);

			resolve(vm);

		};

		resolve(vm);

	});

}

function notify(componentName, ...args) {

	listeners[componentName].apply(undefined, args);

}

window.manila.component = component;
window.manila.notify = notify;

module.exports = {
	component: component,
	notify: notify
};

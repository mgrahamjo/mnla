'use strict';

const fs = require('fs'),
	path = require('path'),
	manila = require('manila')();

module.exports = modules => {

	let templates = {
			server: {},
			client: '',
			json: []
		},

		req = {
			query: {}
		},

		res = {},

		totalModuleCount = Object.keys(modules).length,

		clientTemplateCount = 0;

	return new Promise(resolve => {

		function update() {

			if (Object.keys(templates.server).length === totalModuleCount && clientTemplateCount === totalModuleCount) {

				templates.json = '<script>window.manila=window.manila||{};window.manila.json=\'{' + templates.json.join(',') + '}\';</script>';

				templates.client += templates.json;

				resolve(templates);

			}

		}
		
		for (let moduleName in modules) {

			if (typeof modules[moduleName] === 'function') {

				res.json = data => {

					templates.json.push(`"${moduleName}":${JSON.stringify(data)}`);

					manila(`${moduleName}.mnla`, data).then(html => {

						templates.server[moduleName] = `<div class="${moduleName}-component" data-component="${moduleName}" data-template="#${moduleName}-template">${html}</div>`;

						update();

					}).catch(err => {

						console.trace(err.stack);

					});

				};

				modules[moduleName](req, res);

			} else {

				templates.server[moduleName] = `<div class="${moduleName}-component" data-component="${moduleName}" data-template="#${moduleName}-template"></div>`;

			}

			fs.readFile(path.join(path.dirname(require.main.filename), `views/${moduleName}.mnla`), (err, file) => {

				templates.client += `<script type="text/template" id="${moduleName}-template">${file}</script>`;

				clientTemplateCount++;

				update();

			});

		}

	});

};
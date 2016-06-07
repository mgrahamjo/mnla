'use strict';

const fs = require('fs'),
	path = require('path'),
	manila = require('manila')();

module.exports = (modules, req, res) => {

	let templates = {
			component: {},
			clientData: '',
			data: []
		},

		totalModuleCount = Object.keys(modules).length,

		clientTemplateCount = 0;

	return new Promise(resolve => {

		function update() {

			if (Object.keys(templates.component).length === totalModuleCount && clientTemplateCount === totalModuleCount) {

				templates.data = '<script>window.manila=window.manila||{};window.manila.data=JSON.parse(\'{' + templates.data.join(',') + '}\');</script>';

				templates.clientData += templates.data;

				resolve(templates);

			}

		}

		function addTemplateData(moduleName, data) {

			templates.data.push(`"${moduleName}":${JSON.stringify(data)}`);

			manila(`${moduleName}.mnla`, data).then(html => {

				templates.component[moduleName] = `<div class="${moduleName}-component" data-component="${moduleName}">${html}</div>`;

				update();

			}).catch(err => {

				console.trace(err.stack);

			});

		}
		
		for (let moduleName in modules) {

			if (typeof modules[moduleName] === 'function') {

				res.json = data => {

					addTemplateData(moduleName, data);

				};

				modules[moduleName](req, res);

			} else if (modules[moduleName]) {

				addTemplateData(moduleName, modules[moduleName]);

			} else {

				templates.component[moduleName] = `<div class="${moduleName}-component" data-component="${moduleName}"></div>`;

			}

			fs.readFile(path.join(path.dirname(require.main.filename), `views/${moduleName}.mnla`), (err, file) => {

				templates.clientData += `<script type="text/template" id="${moduleName}-template">${file}</script>`;

				clientTemplateCount++;

				update();

			});

		}

	});

};
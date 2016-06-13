const manila = require('manila/parse');

let cache = {},

	escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&apos;'
    };

function htmlEscape(str) {

    return str.replace(/[<>'"]/g, c => {

        return escapeMap[c];

    });

}

window.manila = window.manila || {};

window.manila.e = function(val) {

    return typeof val === 'string' ? htmlEscape(val) : val;
    
};

module.exports = function compile(selector) {

	return new Promise(resolve => {

		if (!selector) {

			resolve( ()=>{} );

		} else {

			if (cache[selector]) {

				resolve(cache[selector]);

			}

			cache[selector] = manila(document.querySelector(selector).innerHTML);

			resolve(cache[selector]);

		}

	});

};

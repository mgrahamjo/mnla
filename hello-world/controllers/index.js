// controllers/index.js
const 
    manila = require('mnla/server'),
    // message is the controller for a JSON endpoint
    message = require('./message');

module.exports = (req, res) => {

    manila({
        // Here we define our component names and underlying data sources:
        message: message,
        input: message
    },
    // Don't forget to pass req and res to component controllers:
    req, res)
    .then(templateData => {
        res.render('index', templateData);
    });
};
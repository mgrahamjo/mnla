// index.js
const express = require('express'),
    app = express(),
    mnla = require('mnla')();

app
    // Define the location of your static assets:
    .use(express.static('assets'))
    // If you aren't using a bundler like Browserify,
    // add a static route for the MNLA source code:
    .use(express.static('node_modules/mnla'))
    // Tell Express to use the MNLA template engine:
    .engine('mnla', mnla)
    .set('view engine', 'mnla')
    // Set up some routes:
    .get('/', require('./controllers/index'))
    .get('/message', require('./controllers/message')) // JSON endpoint
    // Start the app
    .listen(1337, () => {
        console.log('Listening on localhost:1337');
    });
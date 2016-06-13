# MNLA

MNLA is a wrapper for the Manila template engine that provides universal (isomorphic) rendering and client-side data binding. It adds only 2.5KB of client-side code and 2KB of server-side code on top of the Manila template engine, which is 4KB of server-side code.

## Installation

```
npm install mnla --save
```

This documentation assumes you are using [Express](expressjs.com).

## Example Setup

You can demo the Hello World yourself:

```
git clone https://github.com/mgrahamjo/mnla && cd mnla/hello-world && npm install && node index
```

### Server side:

```javascript
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
```

```javascript
// controllers/message.js
// Here is a controller for the json endpoint /message. 
module.exports = (req, res) => {
    res.json({
        message: "hello, world!"
    });
};
```

```javascript
// controllers/index.js
const manila = require('mnla/server');

module.exports = (req, res) => {
    manila({
        // Here we define our component names and underlying data sources:
        // You can pass a json endpoint as a data source:
        message: require('./message'),
        // Or you can pass raw data:
        input: {
            message: "hello, world!"
        },
        // If you wanted to set up a client-side component
        // that isn't rendered on the server side, you would pass null
        // clientComponent: null
    },
    // Don't forget to pass req and res (the 'message' controller we included expects them)
    req, res)
    .then(templateData => {
        res.render('index', templateData);
    });
};
```

```html
<!-- views/message.mnla -->
<!-- This is the template for the message component -->
<h1><:message:></h1>
```

```html
<!-- views/input.mnla -->
<!-- This is the template for the input component -->
<!-- 'on' is a special method that you can use to listen to DOM events. -->
<!-- 'updateMessage' is a custom handler that we'll define in a client side script. -->
<input type="text" <:on('input', updateMessage):> value="<:message:>" />
```

```html
<!-- views/index.mnla -->
<!DOCTYPE html>
<html>
<head>
    <title>MNLA</title>
</head>
<body>
    <!-- since we've set up the 'message' and 'input' components, we can render them thusly: -->
    <::component.message::>
    <::component.input::>

    <!-- to allow client-side data binding, include this at the end of the body: -->
    <::clientData::>
    <!-- and don't forget your client side scripts: -->
    <script src="/dist.js"></script> <!-- this is from the node_modules/mnla folder -->
    <script src="/js/app.js"></script> <!-- this is from the assets folder -->
</body>
</html>
```

### Client side:

```javascript
// assets/js/app.js
manila
.component('message', vm => {
    // When this runs, vm (view model) is already populated with the properties
    // that the 'message' controller set on the server side. 
    // You can add additional methods and properties to vm here.
    // Return an object with methods that can be called by other components.
    return {
        update: message => {
            vm.message = message;
        }
    };
})
.component('input', vm => {
    // Here we define the updateMessage method we used in the template as an event listener.
    vm.updateMessage = event => {
        // Inform the message component of the new value using the 'update' method we created.
        manila.components.message.update(event.target.value);
    };
});
```

Now you can run `node index`, and open up http://localhost:1337. The html is populated with the "hello, world!" message even before the client side javascript runs, and it stays up-to-date as you update the input.

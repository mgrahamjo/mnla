# MNLA

MNLA is a wrapper for the [Manila](https://github.com/mgrahamjo/manila) template engine. It allows you to bind your server-side Manila templates to client side components, re-rendering the templates when the underlying data model changes.

## Installation

```
npm install mnla --save
```

This documentation assumes you are using [Express](expressjs.com).

## Example Setup

### Server side:

```javascript
// index.js
const express = require('express'),
    app = express(),
    mnla = require('mnla')();

app
    // Define the location of your static assets:
    .use(express.static('assets'))
    .use('/assets', express.static('assets'))
    // If you aren't using a bundler like Browserify,
    // make a static route for the MNLA source code:
    .use('/node_modules/mnla', express.static('node_modules/mnla'))
    // Tell Express to use the MNLA template engine:
    .engine('mnla', mnla)
    .set('view engine', 'mnla')
    .set('views', './views')
    // Set up some routes:
    .get('/', require('./controllers/index'))
    .get('/message', require('./controllers/message')); // JSON endpoint

app.listen(1337, () => {
    console.log('Listening on localhost:1337');
});
```

```javascript
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
```

```javascript
// controllers/message.js
// component controllers
module.exports = (req, res) => {
    res.json({
        message: "hello, world!"
    });
};
```

```html
<!-- views/message.mnla -->
<h1><:message:></h1>
```

```html
<!-- views/input.mnla -->
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
    <script src="/node_modules/mnla/dist.js"></script>
    <script src="/assets/js/app.js"></script>
</body>
</html>
```

### Client side:

```javascript
// assets/js/app.js
manila
.component('message', vm => {
    // Add methods and properties to vm (view model) here.
    // Return an object with methods that can be called by other components
    return {
        update: message => {
            vm.message = message;
        }
    };
})
.component('input', vm => {
    // Here we define the updateMessage method we used in the template.
    vm.updateMessage = event => {
        // Inform the message component of the new value
        // using the 'update' method we created
        manila.components.message.update(event.target.value);
    };
});
```

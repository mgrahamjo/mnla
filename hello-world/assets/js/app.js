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
        vm.message = event.target.value;
        // Inform the message component of the new value
        // using the 'update' method we created
        manila.components.message.update(vm.message);
    };
});
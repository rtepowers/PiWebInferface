/**
 * Created by raypowers on 8/8/15.
 */
var app = Marionette.Application.extend({
    initialize: function (options) {
        console.log('Rapberry Pi Web Interface Loaded');
        console.log('Marionette application started');
    }
});

app = new app({container: '#app' });

app.on('start', function (options) {
    if (Backbone.history) {
        Backbone.history.start();
    }
});

app.start();
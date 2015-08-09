/**
 * Created by raypowers on 8/8/15.
 */
var app = new Marionette.Application();

app.RaspView = Marionette.ItemView.extend({
    el: '#rasp-main',
    template: '#main-region-template'
});

app.on('start', function(options) {
    Backbone.history.start();
    console.log('Application Started');
    var raspView = new app.RaspView();
    raspView.render();
});

$(document).ready(function() {app.start();});
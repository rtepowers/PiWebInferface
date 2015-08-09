/**
 * Created by raypowers on 8/8/15.
 */
var app = new Marionette.Application();

app.addRegions({
    appRegion: '#rasp-main',
    menuRegion: '#rasp-menu'
});

app.Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index'
    }
});

app.Controller = Marionette.Controller.extend({
    index: function() {
        var view = new app.RaspView();
        app.appRegion.show(view);
    }
});

app.RaspView = Marionette.ItemView.extend({
    template: '#main-region-template'
});

app.on('start', function(options) {

    // Build Regions
    console.log('Application Started');
    app.controller = new app.Controller();
    app.router = new app.Router({
        controller: app.controller
    });

    // Start tracking history
    Backbone.history.start();
});

$(document).ready(function() {app.start();});
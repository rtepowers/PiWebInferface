// AUTHOR: Ray Powers, August 2015

// Regular Site
var express = require('express'),
    app = express(),
    port = 12006;

// Web Sockets
var http = require('http').Server(app),
    io = require('socket.io')(http);

// Server Static Files
app.use(express.static('public'));


// Users
var userCount = 0;
var pinSettings = {
                    pin17: false,
                    pin22: false,
                    pin27: false
                };

io.on('connection', function(socket) {
    userCount++;
    console.log('User connected: ' + userCount);
    socket.on('disconnect', function() {
        console.log('User Disconnected');
        userCount--;
    });
    socket.on('turn on', function(pinID) {
        console.log('Turning On: ' + pinID);
        if (!pinSettings[pinID]) {
            pinSettings[pinID] = true;
        }
        io.emit('pin status', {id: pinID, isOn: true });
    });
    socket.on('turn off', function(pinID) {
        console.log('Turning Off: ' + pinID);
        if (pinSettings[pinID]) {
            pinSettings[pinID] = false;
        }
        io.emit('pin status', {id: pinID, isOn: false });
    });
});

http.listen(port, function() {
    console.log('Now listening to port: ' + port);
});
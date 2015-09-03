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


// Pin Control
var GPIO = require('onoff').Gpio,
    blue = new GPIO(22, 'out'),
    green = new GPIO(27, 'out'),
    red  = new GPIO(17, 'out'),
    pir = new GPIO(18, 'in', 'rising');

var pinSettings = {
                    pin17: false,
                    pin22: false,
                    pin27: false,
		    pin18: false
                };

function updateLED() {
    red.writeSync(pinSettings['pin17'] ? 1 : 0 );
    green.writeSync(pinSettings['pin27'] ? 1 : 0 );
    blue.writeSync(pinSettings['pin22'] ? 1 : 0 );
}


io.on('connection', function(socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User Disconnected');
    });
    socket.on('turn on', function(pinID) {
        console.log('Turning On: ' + pinID);
        if (!pinSettings[pinID]) {
            pinSettings[pinID] = true;
        }
        io.emit('pin status', {id: pinID, isOn: true });
        updateLED();
    });
    socket.on('turn off', function(pinID) {
        console.log('Turning Off: ' + pinID);
        if (pinSettings[pinID]) {
            pinSettings[pinID] = false;
        }
        io.emit('pin status', {id: pinID, isOn: false });
        updateLED();
    });
});

pir.watch(function(err, value) {
    if (err) {
        throw err;
    }

    console.log('Motion Detected!');
    io.emit('pin status', {id: 'pin18', isOn: value });
});

http.listen(port, function() {
    console.log('Now listening to port: ' + port);
});

function exit() {
    blue.unexport();
    green.unexport();
    red.unexport();
    pir.unexport();
    process.exit();
}
process.on('SIGINT', exit);

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
    pir = new GPIO(18, 'in', 'both');

var pinSettings = {
                    pin17: false,
                    pin22: false,
                    pin27: false,
                    pin18: false,
                    pin4: false
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
        io.emit('pin status', {id: pinID, isInput: false, isOn: true });
        updateLED();
    });
    socket.on('turn off', function(pinID) {
        console.log('Turning Off: ' + pinID);
        if (pinSettings[pinID]) {
            pinSettings[pinID] = false;
        }
        io.emit('pin status', {id: pinID, isInput: false, isOn: false });
        updateLED();
    });
});

pir.watch(function(err, value) {
    if (err) {
        throw err;
    }

    var status = 'Motion has ' + ((value) ? 'started' : 'stopped');
    console.log(status);
    io.emit('pin status', {id: 'pin18', isInput: true, isOn: value });
});

// Temperature Control
var sensorLib = require('node-dht-sensor');

var dht_sensor = {
    initialize: function() {
        return sensorLib.initialize(11, 4);
    },
    read: function() {
        var readout = sensorLib.read(),
            temp = readout.temperature * (9 / 5) + 32;
        io.emit('temp update', {temp: temp.toFixed(1) + ' F', humidity: readout.humidity + ' %'});
        setTimeout(function () {
            dht_sensor.read();
        }, 2000);
    }
};

if (dht_sensor.initialize()) {
    dht_sensor.read();
} else {
    console.warn('Failed to initialize temp sensor');
}

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

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Raspberry Pi Web Interface');
});

// Server Static Files
app.use(express.static('public'));

var server = app.listen(12006, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('Now listening to http://' + host + ':' + port);
});
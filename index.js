// AUTHOR: Ray Powers

// Globals
var ONE_DAY = 1000 * 60 * 60 *24;

// Dependencies
var express = require('express');
var compression = require('compression');

// New App
var app = express();

// Router
var router = express.Router();

// Start
router.get('/', function( req, res) {
    res.end('RaspberryWeb');
});

// Register Routes
app.use(router);
app.use(express.static(__dirname + '/public', { maxAge: ONE_DAY }));

// Add Compression MiddleWare
app.use(compression());

// Start
app.listen(12006);
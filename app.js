// AUTHOR: Ray Powers

// Globals
var ONE_DAY = 1000 * 60 * 60 * 24;
var PORT = 12006;

// Dependencies
var express = require('express');
var path = require('path');
var compression = require('compression');
var handlebars = require('express-handlebars');

// New App
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handlebars({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Router
var router = express.Router();

// Start
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/test', function(req, res) {
    res.render('testMain', {layout: 'test' });
});

// Register Routes
app.use(router);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: ONE_DAY }));

// Add Compression MiddleWare
app.use(compression());

// Start
app.listen(PORT, function () { console.log('Listening To Port: ' + PORT); });
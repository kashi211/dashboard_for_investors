var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var load 		 = require('express-load');
var mongoose     = require('mongoose');
var config       = require('./config/database');
var flash        = require('express-flash');
var moment 		 = require('moment');
var expressValidator = require('express-validator');

mongoose.connect(config.database, (err) => {
	if(err){
		console.log("Mongo error. "+ err);
	} else {
		console.log("Connection successful.");
	}
});
var db = mongoose.connection;

var app = express();

var erros = require('./middleware/errors');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(cookieParser());
app.use(session({ 
	secret: 'taqueopa', 
	resave: true,
  	saveUninitialized: false}));
app.use(flash());

app.use(function(req,res,next){
	res.locals.moment = moment;
	res.locals.session = req.session.user;
	res.locals.isLogged = req.session.user ? true : false;
	next();
});

load('models').then('controllers').then('routes').into(app);
app.use(express.static(path.join(__dirname, '/public')));

app.use(erros.notfound);
app.use(erros.serverError);

app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});
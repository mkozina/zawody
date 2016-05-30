"use strict";

var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'development';

var sessionSecret = 'kociSekrecik23';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: sessionSecret
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

if ('development' == env) {
	app.use(logger('dev'));
} else {
	app.use(logger('short'));
}

mongoose.connect('mongodb://localhost/zawody');

let routes = require('./routes');

app.get('/', routes.index);

let server = http.createServer(app);

server.listen(port, function () {
	console.log('Serwer pod adresem http://localhost:' + port + '/');
});

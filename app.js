"use strict";

var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zawody');

var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var sessionStore = new mongoStore({mongooseConnection: mongoose.connection});
var expressLayouts = require('express-ejs-layouts');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var socketIo = require('socket.io');
var passportSocketIo = require('passport.socketio');

var app = express();

var fs = require('fs');
var https = require('https');
var server = https.createServer({
	key: fs.readFileSync('./ssl/my.key'),
	cert: fs.readFileSync('./ssl/my.crt')
}, app);

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'development';

var sessionSecret = 'kociSekrecik23';
var sessionKey = 'express.sid';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(expressLayouts);

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	resave: false,
	saveUninitialized: false,
	key: sessionKey,
	secret: sessionSecret,
	store: sessionStore
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

let routes = require('./routes');

app.get('/', routes.index);
app.get('/cref', routes.cref);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/cref', routes.crefPost);
app.post('/login', passport.authenticate('local'), routes.loginPost);
app.get('/admin', routes.admin);
app.get('/ref', routes.ref);

let sio = socketIo.listen(server);

let onAuthorizeSuccess = function (data, accept) {
	console.log('Udane połączenie z socket.io');
	accept(null, true);
};

let onAuthorizeFail = function (data, message, error, accept) {
	if (error) {
		throw new Error(message);
	}
	console.log('Nieudane połączenie z socket.io:', message);
	accept(null, false);
};

sio.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same cookieParser middleware as registered in express
  key:          sessionKey,         // the name of the cookie storing express/connect session_id
  secret:       sessionSecret,      // the session_secret used to parse the cookie
  store:        sessionStore,       // sessionstore – should not be memorystore!
  success:      onAuthorizeSuccess, // *optional* callback on success
  fail:         onAuthorizeFail     // *optional* callback on fail/error
}));

sio.sockets.on('connection', function (socket) {

});

server.listen(port, function () {
	console.log('Serwer pod adresem https://localhost:' + port + '/');
});

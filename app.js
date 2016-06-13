"use strict";

var rooms = [];
var i_room = 0;
var exist = 0;

exports.rooms = rooms;

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

//console.log(addresses[0]);

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
app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/login', routes.login);
app.post('/login', passport.authenticate('local'), routes.loginPost);
app.get('/logout', routes.logout);

app.get('/admin', routes.admin);

app.get('/lref', routes.lref);
app.get('/cref', routes.cref);
app.post('/cref', routes.crefPost);
app.get('/rref', routes.rref);
app.get('/uref', routes.uref);
app.post('/uref', routes.urefPost);
app.post('/dref', routes.drefPost);

app.get('/lcontestant', routes.lcontestant);
app.get('/ccontestant', routes.ccontestant);
app.post('/ccontestant', routes.ccontestantPost);
app.get('/rcontestant', routes.rcontestant);
app.get('/ucontestant', routes.ucontestant);
app.post('/ucontestant', routes.ucontestantPost);
app.post('/dcontestant', routes.dcontestantPost);

app.get('/lcontest', routes.lcontest);
app.get('/ccontest', routes.ccontest);
app.post('/ccontest', routes.ccontestPost);
app.get('/rcontest', routes.rcontest);
app.get('/ucontest', routes.ucontest);
app.post('/ucontest', routes.ucontestPost);
app.post('/dcontest', routes.dcontestPost);

app.get('/lgroup', routes.lgroup);
app.get('/cgroup', routes.cgroup);
app.post('/cgroup', routes.cgroupPost);

app.get('/contestadmin', routes.contestadmin);

app.get('/ref', routes.ref);

app.get('/contestref', routes.contestref);

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
	console.log('Uruchomiłem kanał "/"');

	socket.on('contest', function (data) {
		console.log('/: ' + data);
		socket.join(data);
		var r;
		for(r=0;r<rooms.length;++r){
			if (rooms[r] == data) exist=1;
		}
		if (exist == 0) {
			rooms[i_room] = data;
			i_room++;
		}
		exist=0;
		console.log(rooms);
	});

	socket.on('group', function (data) {
		console.log('/: ' + data);
		socket.broadcast.emit('group', data);
	});

	socket.on('contestant', function (data) {
		console.log('/: ' + data);
		socket.broadcast.emit('contestant', data);
	});

	socket.on('refs', function (data) {
		console.log('/: ' + data);
		socket.broadcast.emit('refs', data);
	});

	socket.on('score', function (data) {
		console.log('/: ' + data);
		socket.broadcast.emit('score', data);
	});

});

server.listen(port, addresses[0], function () {
	console.log('Serwer pod adresem https://' + addresses[0] + ':' + port + '/');
});

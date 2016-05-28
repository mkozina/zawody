"use strict";

var path = require('path');
var http = require('http');
var express = require('express');
var app = express();

var socketIo = require('socket.io');
var passportSocketIo = require('passport.socketio');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zawody');
var db = mongoose.connection;

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

let server = http.createServer(app);

server.listen(app.get('port'), function () {
	console.log('Serwer pod adresem http://localhost:' + app.get('port') + '/');
});

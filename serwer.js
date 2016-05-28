"use strict";

var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var socketio = require('socket.io');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zawody');
var db = mongoose.connection;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

let server = http.createServer(app);

server.listen(3000, function () {
	console.log('Serwer pod adresem http://localhost:3000/');
});

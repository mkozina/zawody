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
var async = require('async');
mongoose.connect('mongodb://localhost/zawody');

var Group = require('./models/group');
var Score = require('./models/score');
var FinalScore = require('./models/finalscore');

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

app.use(favicon(__dirname + '/public/img/favicon.ico'));
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

app.get('/scores', routes.scores);
app.get('/contestscores', routes.contestscores);

app.get('/contact', routes.contact);
app.get('/about', routes.about);

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
	});

	socket.on('ref_start', function (data) {
		socket.broadcast.emit('ref_start', data);
	});

	socket.on('group', function (data) {
		socket.broadcast.emit('group', data);
	});

	socket.on('contestant', function (data) {
		socket.broadcast.emit('contestant', data);
	});

	socket.on('refs', function (data) {
		socket.broadcast.emit('refs', data);
	});

	socket.on('score', function (data) {
		socket.broadcast.emit('score', data);
	});

	socket.on('score_backup', function (data) {
		socket.broadcast.emit('score_backup', data);
	});

	socket.on('db', function (data) {
		socket.broadcast.emit('db', data);
		var str = data.split("-");
		var newScore = new Score({
			contest: str[0],
			group: str[1],
			no: str[2],
			ref: str[3],
			typ: str[4],
			glowa: str[5],
			kloda: str[6],
			nogi: str[7],
			ruch: str[8]
		});
		newScore.save(function (err, item) {
		});

	});

	socket.on('stop', function (data) {
		socket.broadcast.emit('stop', data);
	});

	socket.on('finish', function (data) {
		socket.broadcast.emit('finish', data);
	});

	socket.on('calc', function (data) {

		async.series([

		function (done) {

			Group.find({ nameofcontest: data}, function(err, groups) {

				groups.forEach(function(group) {

					group.grouplist.forEach(function(grouplist) {

							var groupname = group.name;
							var contestantno = grouplist.no;
							var contestantname = grouplist.name;

						Score.find({ contest: data, group: group.name, no: grouplist.no }, function(err, scores) {
							var finalscore = 0;
							var no = 0;
							var typ = 0;
							var ruch = 0;
							scores.forEach(function(score) {
								no++;
								finalscore = finalscore +
									parseInt(score.typ,10) + 
									parseInt(score.glowa,10) + 
									parseInt(score.kloda,10) + 
									parseInt(score.nogi,10) + 
									parseInt(score.ruch,10);
								typ = typ + parseInt(score.typ,10);
								ruch = ruch + parseInt(score.ruch,10);
							});
							finalscore = finalscore / no;
							finalscore = finalscore.toFixed(0);
							typ = typ / no;
							typ = typ.toFixed(0);
							ruch = ruch / no;
							ruch = ruch.toFixed(0);

							socket.broadcast.emit('calc', data+'-'+groupname+'-'+contestantno+'-'+contestantname+'-'+finalscore);

							var newFinalScore = new FinalScore({
								contest: data,
								group: groupname,
								no: contestantno,
								name: contestantname,
								score: finalscore,
								typ: typ,
								ruch: ruch,
								rank: 0,
								remis: 0
							});
							newFinalScore.save(function (err, item) {
							});

						});

					});

				});

				done(err);

			});

		},

		function (done) {

			Group.find({ nameofcontest: data}, function(err, groups) {
				groups.forEach(function(group) {
				FinalScore.find({ contest: data, group: group.name}, function(err, finalscores) {
					var ranking = [];
					var i = 0;
					finalscores.forEach(function(finalscore) {
						if( ranking.length == 0 ) {
							ranking[i] = finalscore;
							i++;
						}
						else {
							var actual_score = parseInt(finalscore.score,10);
							var actual_typ = parseInt(finalscore.typ,10);
							var actual_ruch = parseInt(finalscore.ruch,10);
							var r_len = ranking.length;
							for (var j = 0; j < r_len; j++) {
								var score = parseInt(ranking[j].score,10);
								var typ = parseInt(ranking[j].typ,10);
								var ruch = parseInt(ranking[j].ruch,10);
								if(
									(actual_score > score) ||
									((actual_score == score) && (actual_typ > typ)) ||
									((actual_score == score) && (actual_typ == typ) && (actual_ruch > ruch))
								) {
									ranking.splice(j, 0, finalscore);
									break;
								}
								else if( (actual_score == score) && (actual_typ == typ) && (actual_ruch == ruch) ) {
									ranking[j].remis = "R";
									finalscore.remis = "R";
									ranking.splice(j, 0, finalscore);
									break;
								}
								else if( (j+1) == r_len ) {
									ranking.push(finalscore);
								}
							}
						}
					});

					var prev_remis = 0;
					var counter = 0;
					ranking.forEach(function(item, index) {
						if( !(prev_remis == "R" && item.remis == "R") ) counter++;
						item.rank = counter;
						FinalScore.findOneAndUpdate(
							{ no: item.no },
							{ $set: { rank: counter, remis: item.remis } },
							{new: true},
							function(err, doc){
    						if(err){
        					console.log("Something wrong when updating data!");
    						}
					    	console.log(doc);
						});
						prev_remis = item.remis;
					});

					socket.broadcast.emit('ranking', ranking);
				});

				});
				done(err);
			});
		}],

    function (err) {
        if (err) {
            console.log(err);
        }
    }

		);

	});



});

server.listen(port, addresses[0], function () {
	console.log('Serwer pod adresem https://' + addresses[0] + ':' + port + '/');
});

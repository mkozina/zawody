var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Contestant = require('../models/contestant');
var Contest = require('../models/contest');

exports.index = function (req, res) {
	res.render('index', { user : req.user });
};

exports.cref = function (req, res) {
	res.render('cref', { });
};

exports.login = function (req, res) {
	res.render('login', { user : req.user });
};

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.crefPost = function(req, res) {
	Account.register(new Account({ username: req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('cref', { account: account });
		}
		res.redirect('/admin');
	});
};

exports.loginPost = function(req, res) {
	if (req.user.type == "admin") res.render('admin', {});
	else res.render('ref', {});
};

exports.admin = function (req, res) {
	if (req.user) {
		if (req.user.type == "admin") res.render('admin', { });
		else res.render('error', {});
	} else {
		res.render('error', {});
	}
};

exports.ref = function (req, res) {
	if (req.user) {
		if (req.user.type == "ref") res.render('ref', { });
		else res.render('error', {});
	} else {
		res.render('error', {});
	}
};

exports.ccontestant = function (req, res) {
	res.render('ccontestant', { err: null });
};

exports.ccontestantPost = function(req, res) {
	var newContestant = new Contestant({
		name: req.body.name,
		sex: req.body.sex,
		dateofbirth: req.body.dateofbirth,
		breeder: req.body.breeder
	});
	newContestant.save(function (err, item) {
		if (!err) {
			console.log(item);
			return res.redirect('/admin');
		} else {
			console.dir(err);
			return res.render('ccontestant', { err: err });
		}        
    });
};

exports.ccontest = function (req, res) {

	Contestant.find({}, function(err, contestants) {
//		var Obj = function(pname, psex) {
//			this.name = pname;
//			this.sex = psex;
//		};
		var contestantArr = [];
		var i = 0;
		contestants.forEach(function(contestant) {
//			var newObj = new Obj(contestant.name, contestant.sex);
			contestantArr[i] = contestant;
//			console.dir(contestantArr[i]);
			i++;
		});

		res.render('ccontest', { err: null, contestants: contestantArr });
	});

};

exports.ccontestPost = function(req, res) {
	var newContest = new Contest({
		name: req.body.name,
		scores: req.body.scores,
		granulation: req.body.granulation,
		noref: req.body.noref,
		dateofcontest: req.body.dateofcontest,
		startinglist: req.body.arr
	});
	newContest.save(function (err, item) {
		if (!err) {
			console.log(item);
			return res.send({redirect: '/admin'});
		} else {
			console.dir(err);
			return res.render('ccontest', { err: err });
		}        
    });
};

var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Contestant = require('../models/contestant');
var Contest = require('../models/contest');
var Group = require('../models/group');

exports.index = function (req, res) {
	res.render('index', { user : req.user });
};

exports.login = function (req, res) {
	res.render('login', { user : req.user });
};

exports.loginPost = function(req, res) {
	if (req.user.type == "admin") res.render('admin', {});
	else if (req.user.type == "ref") res.render('ref', {});
};

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.admin = function (req, res) {
	if (req.user) {
		if (req.user.type == "admin") res.render('admin', { });
		else res.render('error', {});
	} else {
		res.render('error', {});
	}
};

exports.lref = function (req, res) {
	Account.find({}, function(err, accounts) {
		var accountArr = [];
		var i = 0;
		accounts.forEach(function(account) {
			accountArr[i] = account;
			i++;
		});
		res.render('lref', { err: null, accounts: accountArr });
	});
};

exports.cref = function (req, res) {
	res.render('cref', { });
};

exports.crefPost = function(req, res) {
	Account.register(new Account({ username: req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('cref', { account: account });
		}
		res.redirect('/lref');
	});
};

exports.rref = function(req, res) {
	var nameofref = req.query.username;
	
	Account.findOne({ username: nameofref}, function (err, doc){
		res.render('rref', { account: doc });
	});
};

exports.uref = function (req, res) {
	var nameofref = req.query.username;

	Account.findOne({ username: nameofref }, function (err, doc){
		res.render('uref', { account: doc });
	});
};

exports.urefPost = function(req, res) {
	var nameofref = req.body.username;

	Account.findOneAndRemove({ username: nameofref }, function(err, doc){

	});
	Account.register(new Account({ username: req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('uref', { account: account });
		}
		res.redirect('/lref');
	});
};

exports.drefPost = function(req, res) {
	var nameofref = req.body.username;

	Account.findOneAndRemove({ username: nameofref }, function(err, doc){
		res.redirect('/lref');
	});
};

exports.lcontestant = function (req, res) {
	Contestant.find({}, function(err, contestants) {
		var contestantArr = [];
		var i = 0;
		contestants.forEach(function(contestant) {
			contestantArr[i] = contestant;
			i++;
		});
		res.render('lcontestant', { err: null, contestants: contestantArr });
	});
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
			return res.redirect('/lcontestant');
		} else {
			console.dir(err);
			return res.render('ccontestant', { err: err });
		}        
    });
};

exports.rcontestant = function(req, res) {
	var nameofcontestant = req.query.name;
	
	Contestant.findOne({ name: nameofcontestant}, function (err, doc){
		res.render('rcontestant', { contestant: doc });
	});
};

exports.ucontestant = function (req, res) {
	var nameofcontestant = req.query.name;

	Contestant.findOne({ name: nameofcontestant }, function (err, doc){
		res.render('ucontestant', { contestant: doc });
	});
};

exports.ucontestantPost = function(req, res) {
	var nameofcontestant = req.body.name;

	Contestant.findOne({ name: nameofcontestant }, function(err, doc){
		doc.name = req.body.name;
		doc.sex = req.body.sex;
		doc.dateofbirth = req.body.dateofbirth;
		doc.breeder = req.body.breeder;
		doc.save(function (err) {
			if(err) {
				console.error('ERROR!');
			} else res.redirect('/lcontestant');
		});
	});
};

exports.dcontestantPost = function(req, res) {
	var nameofcontestant = req.body.name;

	Contestant.findOneAndRemove({ name: nameofcontestant }, function(err, doc){
		res.redirect('/lcontestant');
	});
};

exports.ref = function (req, res) {
	if (req.user) {
		if (req.user.type == "ref") res.render('ref', { });
		else res.render('error', {});
	} else {
		res.render('error', {});
	}
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

exports.cgroup1 = function (req, res) {

	Contest.find({}, function(err, contests) {
//		var Obj = function(pname, psex) {
//			this.name = pname;
//			this.sex = psex;
//		};
		var contestArr = [];
		var i = 0;
		contests.forEach(function(contest) {
//			var newObj = new Obj(contestant.name, contestant.sex);
			contestArr[i] = contest;
//			console.dir(contestantArr[i]);
			i++;
		});

		res.render('cgroup1', { err: null, contests: contestArr });
	});

};

exports.cgroup1Post = function(req, res) {
	var nameofcontest = req.body.nameofcontest;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		console.log(doc);
		res.render('cgroup2', { contest: doc });
	});
};

exports.cgroup2 = function (req, res) {
	
};

exports.cgroup2Post = function(req, res) {
	var newGroupF = new Group({
		nameofcontest: req.body.nameofcontest,
		name: req.body.namef,
		grouplist: req.body.arrf
	});
	var newGroupM = new Group({
		nameofcontest: req.body.nameofcontest,
		name: req.body.namem,
		grouplist: req.body.arrm
	});
	newContest.save(function (err, item) {
		if (!err) {
			console.log(item);
			return res.send({redirect: '/admin'});
		} else {
			console.dir(err);
			return res.render('cgroup2', { err: err });
		}        
    });
};

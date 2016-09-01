var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Contestant = require('../models/contestant');
var Contest = require('../models/contest');
var Group = require('../models/group');
var app = require('../app');

exports.index = function (req, res) {
	res.render('index', { user : req.user });
};

exports.about = function (req, res) {
	res.render('about', { user : req.user });
};

exports.contact = function (req, res) {
	res.render('contact', { user : req.user });
};

exports.login = function (req, res) {
	res.render('login', { user : req.user });
};

exports.loginPost = function(req, res) {
	if (req.user.type == "admin") res.render('admin', { user : req.user });
	else if (req.user.type == "ref") res.render('ref', { user : req.user, contests: app.rooms });
};

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.admin = function (req, res) {
	if (req.user) {
		if (req.user.type == "admin") res.render('admin', { user : req.user });
		else res.render('error', { user : req.user });
	} else {
		res.render('error', { user : req.user });
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

exports.lcontest = function (req, res) {
	Contest.find({}, function(err, contests) {
		var contestArr = [];
		var i = 0;
		contests.forEach(function(contest) {
			contestArr[i] = contest;
			i++;
		});
		res.render('lcontest', { err: null, contests: contestArr });
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
			return res.send({redirect: '/lcontest'});
		} else {
			console.dir(err);
			return res.render('ccontest', { err: err });
		}        
    });
};

exports.rcontest = function(req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		res.render('rcontest', { contest: doc });
	});
};

exports.ucontest = function (req, res) {
	var nameofcontest = req.query.name;

	Contest.findOne({ name: nameofcontest }, function (err, doc){

		Contestant.find({}, function(err, contestants) {
			var contestantArr = [];
			var i = 0;
			contestants.forEach(function(contestant) {
				contestantArr[i] = contestant;
				i++;
			});

			res.render('ucontest', { err: null, contestants: contestantArr, contest: doc });
		});

	});
};

exports.ucontestPost = function(req, res) {
	var nameofcontest = req.body.name;

	Contest.findOne({ name: nameofcontest }, function(err, doc){
		doc.name = req.body.name;
		doc.scores = req.body.scores;
		doc.granulation = req.body.granulation;
		doc.noref = req.body.noref;
		doc.dateofcontest = req.body.dateofcontest;
		doc.startinglist = req.body.arr;
		doc.save(function (err) {
			if(err) {
				console.error('ERROR!');
			} else res.send({redirect: '/lcontest'});
		});
	});
};

exports.dcontestPost = function(req, res) {
	var nameofcontest = req.body.name;

	Contest.findOneAndRemove({ name: nameofcontest }, function(err, doc){
		res.redirect('/lcontest');
	});
};

exports.lgroup = function(req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		Group.find({ nameofcontest: nameofcontest}, function(err, groups) {
			var groupArr = [];
			var i = 0;
			groups.forEach(function(group) {
				groupArr[i] = group;
				i++;
			});

			res.render('lgroup', { contest: doc, groups: groupArr });
		});

	});
};

exports.cgroup = function (req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){

		Contestant.find({}, function(err, contestants) {
			var contestantArr = [];
			var i = 0;
			contestants.forEach(function(contestant) {
				contestantArr[i] = contestant;
				i++;
			});

			Account.find({}, function(err, accounts) {
				var refArr = [];
				var j = 0;
				accounts.forEach(function(account) {
					if(account.type == "ref") refArr[j] = account;
					j++;
				});

				res.render('cgroup', { refs: refArr, contestants: contestantArr, contest: doc });
			});

		});

	});
};

exports.cgroupPost = function(req, res) {
	var newGroupF = new Group({
		nameofcontest: req.body.nameofcontest,
		name: req.body.namef,
		grouplist: req.body.arrf,
		reflist: req.body.arrfref
	});
	var newGroupM = new Group({
		nameofcontest: req.body.nameofcontest,
		name: req.body.namem,
		grouplist: req.body.arrm,
		reflist: req.body.arrmref
	});
	newGroupF.save(function (err, item) {
		if (!err) {
			console.log(item);
		} else {
			console.dir(err);
			return res.render('cgroup', { err: err });
		}        
   });
	newGroupM.save(function (err, item) {
		if (!err) {
			console.log(item);
			return res.send({redirect: '/lcontest'});
		} else {
			console.dir(err);
			return res.render('cgroup', { err: err });
		}        
    });
};

exports.contestadmin = function (req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		Group.find({ nameofcontest: nameofcontest}, function(err, groups) {
			var groupArr = [];
			var i = 0;
			groups.forEach(function(group) {
				groupArr[i] = group;
				i++;
			});

			res.render('contestadmin', { contest: doc, groups: groupArr });
		});

	});
};

exports.ref = function (req, res) {
	if (req.user) {
		if (req.user.type == "ref") res.render('ref', { user : req.user, contests: app.rooms });
		else res.render('error', { user : req.user });
	} else {
		res.render('error', { user : req.user });
	}
};

exports.contestref = function (req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		Group.find({ nameofcontest: nameofcontest}, function(err, groups) {
			var groupArr = [];
			var i = 0;
			groups.forEach(function(group) {
				groupArr[i] = group;
				i++;
			});

			res.render('contestref', { contest: doc, groups: groupArr, user : req.user });
		});

	});
};

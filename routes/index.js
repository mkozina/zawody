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

exports.contact = function (req, res) {
	res.render('contact', { user : req.user });
};

exports.about = function (req, res) {
	res.render('about', { user : req.user });
};

exports.login = function (req, res) {
	res.render('login', { user : req.user });
};

exports.loginPost = function(req, res) {
	if (req.user.type == "admin") res.render('admin/admin', { user : req.user });
	else if (req.user.type == "ref") res.render('ref/ref', { user : req.user, contests: app.rooms });
};

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.admin = function (req, res) {
	if (req.user.type == "admin") res.render('admin/admin', { user : req.user });
	else res.render('error', { user : req.user });
};

exports.lref = function (req, res) {
	Account.find({}, function(err, accounts) {
		var accountArr = [];
		var i = 0;
		accounts.forEach(function(account) {
			accountArr[i] = account;
			i++;
		});
		if (req.user.type == "admin") res.render('admin/lref', { user : req.user, err: null, accounts: accountArr });
		else res.render('error', { user : req.user });
	});
};

exports.cref = function (req, res) {
	if (req.user.type == "admin") res.render('admin/cref', { user : req.user });
	else res.render('error', { user : req.user });
};

exports.crefPost = function(req, res) {
	Account.register(new Account({ username: req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('admin/cref', { user : req.user, account: account });
		}
		res.redirect('/lref');
	});
};

exports.rref = function(req, res) {
	var nameofref = req.query.username;
	
	Account.findOne({ username: nameofref}, function (err, doc){
		if (req.user.type == "admin") res.render('admin/rref', { user : req.user, account: doc });
		else res.render('error', { user : req.user });
	});
};

exports.uref = function (req, res) {
	var nameofref = req.query.username;

	Account.findOne({ username: nameofref }, function (err, doc){
		if (req.user.type == "admin") res.render('admin/uref', { user : req.user, account: doc });
		else res.render('error', { user : req.user });
	});
};

exports.urefPost = function(req, res) {
	var nameofref = req.body.username;

	Account.findOneAndRemove({ username: nameofref }, function(err, doc){

	});
	Account.register(new Account({ username: req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('admin/uref', { user : req.user, account: account });
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
		if (req.user.type == "admin") res.render('admin/lcontestant', { user : req.user, err: null, contestants: contestantArr });
		else res.render('error', { user : req.user });
	});
};

exports.ccontestant = function (req, res) {
	if (req.user.type == "admin") res.render('admin/ccontestant', { user : req.user, err: null });
	else res.render('error', { user : req.user });
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
			return res.render('admin/ccontestant', { user : req.user, err: err });
		}        
    });
};

exports.rcontestant = function(req, res) {
	var nameofcontestant = req.query.name;
	
	Contestant.findOne({ name: nameofcontestant}, function (err, doc){
		if (req.user.type == "admin") res.render('admin/rcontestant', { user : req.user, contestant: doc });
		else res.render('error', { user : req.user });
	});
};

exports.ucontestant = function (req, res) {
	var nameofcontestant = req.query.name;

	Contestant.findOne({ name: nameofcontestant }, function (err, doc){
		if (req.user.type == "admin") res.render('admin/ucontestant', { user : req.user, contestant: doc });
		else res.render('error', { user : req.user });
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
		if (req.user.type == "admin") res.render('admin/lcontest', { user : req.user, err: null, contests: contestArr });
		else res.render('error', { user : req.user });
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

		if (req.user.type == "admin") res.render('admin/ccontest', { user : req.user, err: null, contestants: contestantArr });
		else res.render('error', { user : req.user });
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
			return res.render('admin/ccontest', { user : req.user, err: err });
		}        
    });
};

exports.rcontest = function(req, res) {
	var nameofcontest = req.query.name;
	
	Contest.findOne({ name: nameofcontest}, function (err, doc){
		if (req.user.type == "admin") res.render('admin/rcontest', { user : req.user, contest: doc });
		else res.render('error', { user : req.user });
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

			if (req.user.type == "admin") res.render('admin/ucontest', { user : req.user, err: null, contestants: contestantArr, contest: doc });
			else res.render('error', { user : req.user });
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

			if (req.user.type == "admin") res.render('admin/lgroup', { user : req.user, contest: doc, groups: groupArr });
			else res.render('error', { user : req.user });
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

				if (req.user.type == "admin") res.render('admin/cgroup', { user : req.user, refs: refArr, contestants: contestantArr, contest: doc });
				else res.render('error', { user : req.user });
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
			return res.render('admin/cgroup', { user : req.user, err: err });
		}        
   });
	newGroupM.save(function (err, item) {
		if (!err) {
			console.log(item);
			return res.send({redirect: '/lcontest'});
		} else {
			console.dir(err);
			return res.render('admin/cgroup', { user : req.user, err: err });
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

			if (req.user.type == "admin") res.render('admin/contestadmin', { user : req.user, contest: doc, groups: groupArr });
			else res.render('error', { user : req.user });
		});

	});
};

exports.ref = function (req, res) {
	if (req.user.type == "ref") res.render('ref/ref', { user : req.user, contests: app.rooms });
	else res.render('error', { user : req.user });
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

			if (req.user.type == "ref") res.render('ref/contestref', { user : req.user, contest: doc, groups: groupArr });
			else res.render('error', { user : req.user });
		});

	});
};

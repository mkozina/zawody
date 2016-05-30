var express = require('express');
var passport = require('passport');
var Account = require('../models/account');

exports.index = function (req, res) {
	res.render('index', { user : req.user });
};

exports.register = function (req, res) {
	res.render('register', { });
};

exports.login = function (req, res) {
	res.render('login', { user : req.user });
};

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.registerPost = function(req, res) {
	Account.register(new Account({ username : req.body.username }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('register', { account : account });
		}

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
};

exports.loginPost = function(req, res) {
	res.redirect('/');
};

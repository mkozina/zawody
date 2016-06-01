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
	Account.register(new Account({ username : req.body.username, type: req.body.type }), req.body.password,
		function(err, account) {
		if (err) {
			return res.render('register', { account : account });
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

var passport = require('passport');

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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
	nameofcontest: String,
	name: String,
	grouplist: []
});

module.exports = mongoose.model('Group', Group);

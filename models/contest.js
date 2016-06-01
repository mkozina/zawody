var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contest = new Schema({
	name: String,
	scores: String,
	granulation: String,
	noref: String,
	dateofcontest: Date,
	startinglist: []
});

module.exports = mongoose.model('Contest', Contest);

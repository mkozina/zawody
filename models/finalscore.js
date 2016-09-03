var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinalScore = new Schema({
	contest: String,
	group: String,
	no: String,
	name: String,
	score: String
});

module.exports = mongoose.model('FinalScore', FinalScore);

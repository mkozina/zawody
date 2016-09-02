var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Score = new Schema({
	contest: String,
	group: String,
	no: String,
	ref: String,
	typ: String,
	glowa: String,
	kloda: String,
	nogi: String,
	ruch: String
});

module.exports = mongoose.model('Score', Score);

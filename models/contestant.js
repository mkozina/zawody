var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contestant = new Schema({
	name: String,
	sex: String,
	dateofbirth: Date,
	breeder: String
});

module.exports = mongoose.model('Contestant', Contestant);

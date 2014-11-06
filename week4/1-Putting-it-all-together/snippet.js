var mongoose = require('mongoose');

var config = require('./config.json');

mongoose.connect('mongodb://' + (config.mongoUrl || 'localhost'));

var snippetSchema = new mongoose.Schema({
	language: String,
	filename: String,
	code: String,
	creator: String
});

var Snippet = mongoose.model('Snippet', snippetSchema);
module.exports = Snippet;
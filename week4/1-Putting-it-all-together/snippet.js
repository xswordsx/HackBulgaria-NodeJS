var mongoose = require('mongoose');

var config = require('./config.json').mongoData;
var connectionString;
connectionString = ['mongodb://', config.host, ':', config.port, '/', config.databse].join('');
mongoose.connect(connectionString);

var snippetSchema = new mongoose.Schema({
	language: String,
	filename: String,
	code: String,
	creator: String
});

var Snippet = mongoose.model('Snippet', snippetSchema);
module.exports = Snippet;
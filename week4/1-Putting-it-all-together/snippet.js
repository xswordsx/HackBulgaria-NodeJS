var mongoose = require('mongoose');

var config = require('./config.json').mongoData;
var connectionString = ['mongodb://', config.host, ':', config.port,
	'/', config.databse].join('');

var Snippet = function Snippet(params) {
	this.params = params;
};

Snippet.__mongoose = mongoose;

Snippet.connect = function() {
	var db = Snippet.__mongoose.connection;

	Snippet.__mongoose.connect(connectionString);

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
	  console.log('Connection to database successful.');
	});
};

Snippet.close = function() {
	mongoose.connection.close();
};

Snippet.prototype.save = function(callback) {
	var mongoose = Snippet.__mongoose;
	var db = mongoose.connection;

	var snippetSchema = mongoose.Schema({
		language: {type: String},
		filename: {type: String, index: true},
		code: {type: String},
		creator: {type: String}
	});

	var SnippetModel = mongoose.model('Snippet', snippetSchema);
	var newEntry = new SnippetModel(this.params);
	newEntry.save(function(err){
		if(err) {
			console.error("Could not save entry:", this.params.filename);
		} else {
			callback();
		}
	});
};

module.exports = Snippet;

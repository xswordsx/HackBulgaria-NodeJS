var mongoose = require('mongoose');
var path = require('path');

var config = require(path.resolve(__dirname + '/../config.json')).database;

var uri = "";
if(config.auth && config.auth.username && config.auth.password) {
	uri += config.auth.username + ":" + config.auth.password + "@";
}
uri += config.url + ":" + config.port + "/" + config.db;

var contactSchema = new mongoose.Schema({
	phoneNumber: {
		type: String,
		required: true,
		match: /^(\+?)(\d(\-|\ )?)+$/
	},
	personIdentifier: {
		type: "ObjectId",
	}
});

function start (log) {
	mongoose.connect(uri, function(err) {
		var url = config.auth ? uri.split('@')[1] : uri;
		if(err) {
			console.error("There was an error connecting to:", url);
			return;
		}
		if(log) {
			console.log("Connection established to:", url);
		}
	});

}

function close (log) {
	mongoose.connection.close(function(err) {
		var url = config.auth ? uri.split('@')[1] : uri;
		if(err) {
			console.error("Unable to close connection to:", url);
		}
		if(log) {
			console.log("Closing mongoose connection.");
		}
	});
}

var Contact = mongoose.model('Contact', contactSchema);

module.exports = {
	model: Contact,
	schema: contactSchema,
	connect: start,
	disconnect: close
};
var mongoose = require('mongoose');
var path = require('path');
var q = require('q');

var config = require(path.resolve(__dirname + '/../config.json')).database;

var uri = "";
if(config.auth && config.auth.username && config.auth.password) {
	uri += config.auth.username + ":" + config.auth.password + "@";
}
uri += config.url + ":" + config.port + "/" + config.db;

var contactSchema = new mongoose.Schema({
	phoneNumber: {
		type: String,
		match: /^(\+?)(\d(\-|\ )?)+$/
	},
	personIdentifier: {
		type: mongoose.SchemaTypes.ObjectId,
	}
});

contactSchema.pre('save', function(next) {
	'use strict';

	this.personIdentifier = this._id;
	next();
});

function start () {
	'use strict';

	var deferred = q.defer();
	mongoose.connect(uri, function(err) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(config.auth ? uri.split('@')[1] : uri);
		}
	});
	return deferred.promise;
}

function close () {
	'use strict';

	var deferred = q.defer();
	mongoose.connection.close(function(err) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(config.auth ? uri.split('@')[1] : uri);
		}
	});
	return deferred.promise;
}


module.exports = {
	model: mongoose.model('Contact', contactSchema),
	schema: contactSchema,
	connect: start,
	disconnect: close
};
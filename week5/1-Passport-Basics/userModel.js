var mongoose = require('mongoose');
var q = require('q');

var User = function() {
	this._mongoose = mongoose;
};

User.prototype.start = function(host, port, db) {
	var connectionString = "mongodb://" + host  + ":" + port + "/" + db;
	this._mongoose.connect(connectionString);
	this.userModel = this._mongoose.model("User", {
		username: String,
		password: String
	});
};

User.prototype.add = function(user, pass) {
	var deferred = q.defer();

	var newUser = new this.userModel({
		username: user,
		password: pass
	});
	newUser.save(function(err){
		if(err) {
			deferred.reject("Unable to save user: " + user);
		} else {
			deferred.resolve("User " + user + " saved.");
		}
	});
	return deferred.promise;
};

User.prototype.authenticate = function(username, pass) {
	var deferred = q.defer();
	this.userModel.findOne({username: username}, function(err, user) {
		if(err) {
			deferred.reject("unable to find user: " + username);
		} else {
			deferred.resolve(user.pass === password);
		}
	});
	return deferred.promise;
}

User.prototype.close = function() {
	this._mongoose.connection.close();
};

module.exports = User;
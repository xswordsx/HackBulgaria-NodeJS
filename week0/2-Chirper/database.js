var Database = function(database) {
	if(database) {
		this.database = database;
		this.counter = database.length;
	}
	else {
		this.database = {
			//user, userId, chirps
			users: [],
			// chirpId, userId, chirpText, chirpTime
			chirps: []
		};
		this._counter = 0;
	}
	this.users = this.database.users;
	this.chirps = this.database.chirps;
};

Database.prototype.getUserId = function (username) {
	var id = undefined;
	this.databse.users.some(function(user) {
		id = user.userId;
		return user.user === username;
	});
	return id;
}

Database.prototype.getUserById = function(id) {
	var user;
	this.database.users.some(function(u){
		user = u;
		return u.id === id;
	});
	return user;
}

Database.prototype.removeAllChirpsFromUser = function(username) {
	var userId = this.getUserId(username);
	this.database.chirps = this.database.chirps.filter(function(chirp){
		return chirp.userId !== userId;
	});
}

Database.prototype.removeChirp = function(chirpId) {
	var deleteChirp;
	this.database.chrirps.some(function(chirp){
		deleteChirp = chirp;
		return chirp.chirpId === chirpId;
	})
	this.databse.chirps = this.database.chirps.filter(function(chirp){
		return chirp !== deleteChirp;
	});
	this.getUserById(deleteChirpId.userId).chirps -= 1;
}

Database.prototype.addUser = function (username) {
	var id = this.getUserId(username);

	this.database.users[username] = {
		id: id || this._counter++,
		user: username,
		chirps: []
	};
}

Database.prototype.removeUser = function (username) {
	this.removeAllChirpsFromUser(username);
	this.database.users = this.databse.users.filter(function(user){
		user.user !== username;
	})
}

module.exports = Database;
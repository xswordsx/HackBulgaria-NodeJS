var keygen = require('keygenerator');
var path = require('path');
var persist = require('node-persist');
var crypto = require('crypto');
var fs = require('fs');


Subscriber = function(savePath, clear) {
	clear = clear || false;
	this._key = fs.readFileSync(__dirname + '/salt').toString('utf8');
	this._ids = keygen;
	this._users = persist;

	persist.init({
		dir: path.resolve(__dirname + '/../' + (savePath || 'database')),
		stringify: JSON.stringify,
		parse: JSON.parse,
		encoding: 'utf8',
		logging: false,
		continuous: true,
		interval: false
	});

	if(clear) {
		persist.clear();
		persist.persistSync();
	}

};

Subscriber.prototype.cipher = function(data, key) {
	key = key || this._key;
	var cipher = crypto.createCipher('aes256', key);
	cipher.update(data, 'utf8', 'base64');
	return cipher.final('base64');
};

Subscriber.prototype.decipher = function(data, key) {
	key = key || this._key;
	var decipher = crypto.createDecipher('aes256', key);
	decipher.update(data, 'base64', 'utf8');ddd
	return decipher.final('utf8');
};

Subscriber.prototype.subscribe = function(data) {
	var newKey = this._ids._();
	//Obsolete
	data.type = data.type.filter(function(type){ return /comment|story/.test(type) });
	data.verified = false;
	data.verifyId = this.cipher(data.email + new Date().getTime());

	this._users.setItem(newKey, data);

	return
	{
		verifyKey: data.verifyId,
		subscriber:
		{
			email: data.email,
			subscriberId: newKey
		}
	};
};

Subscriber.prototype.verify = function(key) {

};

Subscriber.prototype.unsubscribe = function(key) {
	this._users.removeItem(key);
};

Subscriber.prototype.listSubscribers = function() {
	var emails = [];
	this._users.values(function(values){
		values.forEach(function(userInfo){
			emails.push(userInfo.email);
		});
	});
	return emails;
};

module.exports = Subscriber;
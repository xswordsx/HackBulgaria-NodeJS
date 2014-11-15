var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var q = require('q');

var config = require('./config.json');
var Contact = require('./models/contact');

app.use(express.static(__dirname + '/static/'));
app.use('/contact', bodyParser.urlencoded({
	extended: true
}));

app.post('/contact', function (req, res) {
	var contact = new Contact.model({
		phoneNumber: req.body.phoneNumber
	});
	contact.save(function(err) {
		if(err) {
			res.status(400).end("Could not save number: " + err);
		} else {
			var result = "Phone number: " + contact.phoneNumber;
			result += "\n" + "ID: " + contact.personIdentifier;
			res.status(200).end(contact._id);
		}
	});
});

app.get('/contacts', function (req, res) {
	var query = {};
	query.map = function() {
		emit(this._id, {
			phoneNumber: this.phoneNumber,
			personIdentifier: this._id
		});
	};
	query.reduce = function (key, value) {
		return value;
	};
	Contact.model.mapReduce(query, function (err, contacts) {
		if(err) {
			res.status(400).end("Something went wrong: " + err);
		} else {
			var mappedResult = contacts.map(function (contact){
				return contact.value;
			});
			res.status(200).json(mappedResult);
		}
	});
});

app.get('/contact/:id', function (req, res) {
	Contact.model.findOne({_id: req.params.id}, function (err, contact) {
		if(err) {
			res.status(404).end("User not found");
		} else {
			res.status(200).json(contact);
		}
	});
});

app.delete('/contact/:id', function (req, res) {
	Contact.model.findByIdAndRemove(req.params.id, function (err) {
		if(err) {
			res.status(400).end("Could not remove contact with id: " + req.params.id);
		} else {
			res.status(302).end("Removed contact with id: " + req.params.id);
		}
	});
});

var httpServer = app.listen(config.port);
console.log("Smart phonebook server listening on", config.host + ":" + config.port);
Contact.connect()
	.then(function(result){
		console.log("Connected to database:", result);
	})
	.fail(mannerly_close);

function mannerly_close(err) {
	Contact.disconnect()
		.then(function(succ){
			console.log("Connection to database closed.");
		})
		.fail(function(err){
			console.log("Unable to close connection to databse:", err.toString());
		})
		.finally(function (){
			if(err) {
				console.error(err.toString());
			}
			console.log("Exiting node...");
			process.exit(0);
		});
}

process.on("SIGINT", mannerly_close);
process.on("exit", mannerly_close);
process.on("uncaughtException", function (err){
	mannerly_close(err);
});

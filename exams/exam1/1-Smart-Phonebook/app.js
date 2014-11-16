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
		phoneNumber: req.body.phoneNumber,
		personIdentifier: req.body.personIdentifier
	});
	contact.save(function(err) {
		if(err) {
			res.status(400).end("Could not save number: " + err);
		} else {
			res.status(200).json(contact._id);
		}
	});
});

app.get('/contacts', function (req, res) {
	var query = {};
	query.map = function() {
		emit(this._id, JSON.stringify({
			phoneNumber: this.phoneNumber,
			personIdentifier: this.personIdentifier
		}));
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
			res.status(200).json({
				phoneNumber: contact.phoneNumber,
				personIdentifier: contact.personIdentifier
			});
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


app.get('/groups', function (req, res) {
  Contact.model.find({}, function(err, data) {
    if(err) {
      res.status(400).end("Something went wrong:" + err.toString());
    } else {
      var groups = {};
      data.forEach(function(contact) {
        var tags = contact.personIdentifier.split(' ').map(function(tag) {
          return tag[0].toUpperCase() + tag.slice(1).toLowerCase();
        });
        tags.forEach(function(tag) {
          groups[tag] = groups[tag] || [];
          groups[tag].push(contact);
        });
      });
      var result = [];
      Object.keys(groups).forEach(function(group) {
        result.push({
          group: group,
          contacts: groups[group]
        });
      });
      res.status(200).end(JSON.stringify(result, null, 4));
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

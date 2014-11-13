var express = require('express');
var app = express();
var config = require('./config.json');
var Contact = require('./models/contact');

app.post('/contact', function (req, res) {

});

app.get('/contacts', function (req, res) {
  res.json({});
});

app.get('/contact/:id', function (req, res) {
  var currentContact = Contact.get(req.params.id);
  if(currentContact) {
    res.status(200).json(currentContact);
  } else {
    res.status(404).end("Contact does not exist");
  }
});

app.delete('/contact/:id', function (req, res) {

});

app.listen(config.port);
console.log("Smart phonebook server listening on", config.host + ":" + config.port);
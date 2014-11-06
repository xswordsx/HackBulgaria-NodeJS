var express = require('express');
var bodyParser = require('body-parser');
var Snippet = require('./snippet');
var config = require('./config.json');

var app = express();

app.use('/create', bodyParser.json());


app.get('/', function(req, res){
	Snippet.find({}, function(err, snippets){
		if(err) {
			res.status(400).end('Could not connect to database');
		}
		res.status(200).json(snippets);
	});
	console.log('GET /');
});

app.get('*', function(req, res){
	res.status(404).end('Page not found');
})

app.post('/create', function(req, res){
	var integrityCheck = ['language', 'creator', 'code', 'filename']
		.every(function(name){
			return req.body.hasOwnProperty(name);
		});
	if(integrityCheck) {
		console.log('got POST request:', req.body);
		res.status(200).end('POST request successful.');
	} else {
		res.status(400).end('Missing a parameter');
	}
	
});

app.listen(config.port || 3000);

console.log('Server listening to port 3000 (pid: ' + process.pid + ')');

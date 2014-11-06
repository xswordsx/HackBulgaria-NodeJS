var express = require('express');
var bodyParser = require('body-parser');
var Snippet = require('./snippet');
var config = require('./config.json');
config.port = config.port || 3000;

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
		var snippet = new Snippet(req.body);
		console.log('POST:', req.body);
		snippet.save(function(){
			res.status(200).end('POST request successful.');
		});
	} else {
		res.status(400).end('Missing a parameter');
	}
	
});

Snippet.connect();

app.listen(config.port);

console.log('Server listening on port', config.port, '( pid:', process.pid, ')');

// Stop-handling

process.stdin.resume();

function cleanUp(exitCode) {
	console.log("Closing connection to database...");
	Snippet.close();
	console.log("Stopping server...");
	process.exit(exitCode);
};

process.on('SIGINT', function(){
	cleanUp(2);
});
process.on('uncaughtException', function(e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  cleanUp(99);
});

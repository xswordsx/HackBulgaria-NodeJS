var http = require('http');
var fs = require('fs');
var Database = require('./database');
var config = JSON.parse(fs.readFileSync('./config.js'));
var url = config.api_url.split(':');
config.port = url.pop();
config.url = url.join('');

function get(url, callback){
	if(RegExp(url).test(this.request.url) && this.request.method == 'GET'){
		callback(this.request, this.response);
	}
}

function post(url, callback){
	if(RegExp(url).test(this.request.url) && this.request.method == 'POST'){
		callback(this.request, this.response);
	}
}

var chirper = http.createServer(function(request, response){
	// For the code is hard and full of terrors
	this.request = request;
	this.response = response;

	var self = this;
	self.get = get.bind(self);
	self.post = post.bind(self);

	var database = new Database();

	var payload = "";

	request.on('data', function(chunk){
		payload += chunk.toString();
	});

	request.on('end', function(){
		self.get('/all_chirps', function(req, res){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(database.chirps));
		});
		self.get('/all_users', function(req, res){
			res.writeHead(200, {'Content-Type': 'application/json'});
			var users = [];
			Object.keys(database.users).forEach(function(user){
				users.push(database.users[user].name);
			});
			res.end(JSON.stringify(users));
		});
		self.post('/register', function(req, res){
			var payload = '';
			res.on('data', function(res){
				payload += res.toString();
			});
			res.on('end', function(){
				var user = JSON.parse(payload);
				var id = database.addUser(user);
				console.log(id);
				res.end('');
			});
		});
		self.get('/', function(req, res){
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Nothing here, boss.');
		});
		console.log("method:", request.method);
		console.log("URL:", request.url);
	});
});

chirper.listen(config.port);

console.log("Server listening on: " + config.url + ':' + config.port);
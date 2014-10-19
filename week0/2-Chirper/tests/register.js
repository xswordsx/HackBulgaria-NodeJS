var http = require('http');

var options = {
  hostname: 'http://localhost',
  port: 8080,
  path: '/register',
  method: 'POST'
};

var user = {
	user: "ivan"
};

var req = http.request(options, function(res){
	res.setEncoding('utf8');
	res.on('data', function(chunk){
		console.log('got response:', chunk);
	});
});

req.write(JSON.stringify(user));
req.end();
var express = require('express');
var bodyParser = require('body-parser');
var subscriber = require('./subscriber');
var notifier = require('./notifier');

var db = new Subscriber('database', true);

var app = express();

app.use('/subscribe', bodyParser.json());

app.post('/subscribe', function(req, res) {
	var subsciberInfo = db.subscribe(req.body);
	res.json(subsciberInfo.subscriber);
	res.status(201).end();
});

app.post('/unsubscribe', function(req, res) {
	req.on('data', function(data){
		db.unsubscribe(data.toString());
	res.status(201).end();
	});
});

app.get('/listSubscribers', function(req, res) {	
	res.status(201).end(db.listSubscribers().join('\n'));
});


var port = Number(process.argv[2]) || 8080;
console.log('Server listening on port ' + port);
app.listen(port);
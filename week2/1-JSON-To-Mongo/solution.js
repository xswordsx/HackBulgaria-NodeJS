console.log('Loading mongodb...');
var MongoClient = require('mongodb').MongoClient;
console.log('mongodb loaded.');

var config = require('./config'),
	connectionUrl = config.mongoConnectionUrl,
	collectionName = path.basename(process.argv[2], ".json");

console.log('read data:', connectionUrl);

MongoClient.connect(connectionUrl, function(err, db){
	if(err) {
		console.error('something went wrong!');
		console.error(err);
		db.close();
		return;
	}
	var collection = db.collection(collectionName);
	var insertData = require(process.argv[2]);
	collection.insert(insertData, function(err, data){
		if(err) {
			console.error('something went wrong!');
			console.error(err);
			db.close();
			return;
		}
		if(data.length === insertData.length) {
			console.log('Successfully inserted', insertData.length, 'items to', collectionName);
			db.close();
		}
	});
});
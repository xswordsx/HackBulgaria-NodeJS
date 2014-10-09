var fs = require('fs');

function getSections (data) {
	return data
		.split('\n')
		// Search for [DATA]
		.filter(function(line){ return /\[.*\]/.test(line) })
		// Remove the braces [ ]
		.map(function(section){return section.substr(1, section.length - 2)});
};

function getKeyValueList (data) {
	return data
		// Break down data in chunks of key-value properties
		.split(/\[.*\]/)
		// Ignore empty lines
		.filter(function(line){ return line != '' })
		.map(function(properties){ return properties.trim() })
		.filter(function(comments){ return comments[0] != ';'})
};


function fromINItoJS (data) {
	var ini = {};

	var sections = getSections(data.toString());
	
	var kvList = getKeyValueList(data.toString());
	// At this point the variables and their keys are in the same order
	kvList.forEach(function(chunk, index){
		var properties = {};
		chunk.split('\n').forEach(function(kvPair){
			var kv = kvPair.split(/ *= */)
			properties[kv[0]] = kv[1];
		});
		ini[sections[index]] = properties;
	});
	return JSON.stringify(ini, undefined, 2);
};

function fromJStoINI (data) {
	var jsonData = JSON.parse(data.toString());
	var iniFile = [];
	Object.keys(jsonData).forEach(function(section){
		iniFile.push('[' + section + ']');
		Object.keys(jsonData[section]).forEach(function(key){
			iniFile.push(key + '=' + jsonData[section][key]);
		});
	});
	return iniFile.join('\n');
};
// END OF CORE LOGIC

var reqIsURL = /^http/.test(process.argv[2]);
if(reqIsURL) {
	var transferProtocol = /^https/.test(process.argv[2]) ? 'https' : 'http';
	var filename = process.argv[2].split('/').pop();
	if(process.argv[2].substr(-4) == '.ini') {
		filename = filename.substr(0, filename.length - 4);
	}
	transferProtocol = require(transferProtocol);
	transferProtocol.get(process.argv[2], function(res){
		res.on('data', function(data){
			var js = fromINItoJS(data.toString());
			filename += '.js';
			fs.writeFile(filename, js, function(err){
				if(err){
					throw err;
				}
				console.log('Data written successfully to', filename);
			});
		});
	});
} else {
	fs.readFile(process.argv[2], function(err, data){
		if(err){
			console.error("Error:", err);
		} else {
			var data, ext;
			switch (process.argv[2].substr(-3)) {
				case 'ini':
					data = fromINItoJS(data);
					ext = '.js'
				break;
				case '.js':
					data = fromJStoINI(data);
					ext = 'ini';
				break;
				default:
				console.error("Unknown file type");
			}
			var filename = process.argv[2].substr(0, process.argv[2].length - 4) + ext;
			fs.writeFile(filename, data, function(err){
				if(err){
					throw err;
				}
				console.log("Data written to file '", filename, "'");
			});
		};
	});
}
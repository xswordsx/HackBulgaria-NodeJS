var fs = require('fs');
var ArgumentParser = require('argparse').ArgumentParser;

var splitter = process.argv[1].indexOf('\\') === -1 ? '/' : '\\';
var prog = process.argv[1].split(splitter).pop();
var parser = new ArgumentParser({
	prog: prog,
	version: '0.0.1',
	addHelp: true,
	description: 'Converts INI files to JSON and JSON files to INI.'
});

parser.addArgument(
	['filepath'], {
		help: 'The path to the file to be converted.'
	});

parser.addArgument(
	['-t', '--type'], {
		default: null,
		optional: true,
		help: 'The type of file (if not explicitly given).'
	});

var args = parser.parseArgs();

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


function fromINItoJSON (data) {
	var json = {};

	var sections = getSections(data.toString());
	
	var kvList = getKeyValueList(data.toString());
	// At this point the variables and their keys are in the same order
	kvList.forEach(function(chunk, index){
		var properties = {};
		chunk.split('\n').forEach(function(kvPair){
			var kv = kvPair.split(/ *= */)
			properties[kv[0]] = kv[1];
		});
		json[sections[index]] = properties;
	});
	return JSON.stringify(json, undefined, 2);
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

if(/^http/.test(args.filepath)) {
	var transferProtocol = /^https/.test(args.filepath) ? 'https' : 'http';
	var filename = parser.prog;
	if(args.filepath.substr(-4) == '.ini') {
		filename = filename.substr(0, filename.length - 4);
	}
	transferProtocol = require(transferProtocol);
	transferProtocol.get(args.filepath, function(response){
		var payload = '';

		response.on('data', function(chunk){
			payload += data.toString();
		});

		response.on('end', function(){
			var js = fromINItoJSON(payload.toString());
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
	fs.readFile(args.filepath, function(err, data){
		if(err){
			console.error("Error:", err);
		} else {
			var data, ext;
			switch (args.filepath.substr(-3)) {
				case 'ini':
					data = fromINItoJSON(data);
					ext = '.json'
				break;
				case '.js':
					data = fromJStoINI(data);
					ext = 'ini';
				break;
				default:
				console.error("Unknown file type");
			}
			var filename = args.filepath.substr(0, args.filepath.length - 4) + ext;
			fs.writeFile(filename, data, function(err){
				if(err){
					throw err;
				}
				console.log("Data written to file '", filename, "'");
			});
		};
	});
}
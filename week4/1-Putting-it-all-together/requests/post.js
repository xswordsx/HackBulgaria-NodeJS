var request = require('request');
var port = require('../config.json').port;
var clc = require('cli-color');

request(
	{
		url: 'http://localhost:' + port + '/create',
		method: "POST",
		headers: {
			contentType: "application/json"
		},
		json: true,
		body: {
			language: "Ruby",
			filename: "a.rb",
			code: "print('Hello')",
			creator: "xswordsx"
		}
	},
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(clc.green("[OK]"), ':', body);
		} else {
			console.error(clc.red("[Something went wrong]"), ':', error || body);
		}
	});
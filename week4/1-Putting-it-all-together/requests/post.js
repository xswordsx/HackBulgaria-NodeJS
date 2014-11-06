var request = require('request');

request.post('http://localhost:3000/create',
	{
		formData: {
			language: "Ruby",
			filename: "a.rb",
			code: "print('Hello')",
			creator: "xswordsx"
		}
	},
	function(err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);
        }
});
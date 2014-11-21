var q = require('q');

var Monochrome = {};

function convultion(imageData, kernel) {
	var result = [];
	var offset = Math.floor(kernel.length / 2);
	for(var i = 0 ; i < imageData[0].length; i++) {
		result.push([]);
		for(var j = 0 ; j < imageData.length; j++) {
			var sum = 0;
			for(var u = -offset; u < offset; u++) {
				for(var v = -offset; v < offset; v++) {
					var value = insideMatrix(u, v) ? imageData[u][v] : 0; // wrong index
					sum += value * kernel[u][v]; // wrong index
				}
			}
			result[i][j] = sum;
		};
	};
	return result;
};

Monochrome.edgeDetection = function(imageData) {
	var result = q.defer();

	return q.promise;
};

Monochrome.boxBlur = function(imageData) {

};

Monochrome.applyKernel = function(imageData, kernel) {

};

var RGB = {};

module.exports = {
	monochrome: Monochrome,
	rgb: RGB
};
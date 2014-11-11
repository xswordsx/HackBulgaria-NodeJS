var express = require('express');
var app = express();
var passport = require('passport');
var path = require('path');

var config = require(path.resolve(__dirname + '/config.json'));

app.listen(config.port);
console.log("Express server running on", config.host + ":" + config.port);
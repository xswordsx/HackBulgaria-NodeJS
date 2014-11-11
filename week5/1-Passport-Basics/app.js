var express = require('express');
var app = express();
var passport = require('passport');
var path = require('path');
var userModel = require('./userModel');

var config = require(path.resolve(__dirname + '/config.json'));

app.use(express.static(__dirname + '/public'));


app.listen(config.port);
console.log("Express server running on", config.host + ":" + config.port);
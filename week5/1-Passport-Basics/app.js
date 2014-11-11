var express = require('express');
var app = express();
var passport = require('passport');
var path = require('path');

var config = require(path.resovle(__dirname + '/config.json'));

var express = require('express');
var mongojs = require('mongojs');
var winston = require('winston');

var app = module.exports = express();

var connectionString;
if (app.get('env') === 'development') {
  connectionString = 'mongodb://localhost:27017/minhr';
} else if (app.get('env') === 'production') {
  connectionString = 'mongodb://mongo:27017/minhr';
}

var log = winston.loggers.get('normal');

connectDefault = function connect() {
  return mongojs(connectionString, ['personnels', 'jobDescriptions', 'users', 'eventLog']);
}

connectUser = function connect(connString) {
  log.info('Connecting to ' + connString);
  return mongojs(connString, ['personnels', 'jobDescriptions', 'users', 'eventLog']);
}


module.exports = {
  connectDefault: connectDefault,
  connectUser: connectUser
};
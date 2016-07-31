var _ = require('lodash');
var express = require('express');
var mongojs = require('mongojs');
var winston = require('winston');

var app = module.exports = express();
var log = winston.loggers.get('normal');

app.locals.connection = app.locals.connection || [];

var connectionString;
if (app.get('env') === 'development') {
  connectionString = 'mongodb://localhost:27017/resource';
} else if (app.get('env') === 'production') {
  connectionString = 'mongodb://mongo:27017/resource';
}

getConnection = function getConnection(user) {
  var userConnection = _.find(app.locals.connection, ['user', user]);

  if (!userConnection) {
    userConnection = connectUser(user);
  }

  return _.find(app.locals.connection, ['user', user]) ? _.find(app.locals.connection, ['user', user]).db :
    new Error("Couldn't create database connection for " + user); 
}

connectUser = function connect(user) {
  log.info('Connecting to database for user ' + user);

  var connection = mongojs(connectionString + user, ['personnels', 'jobDescriptions', 'users', 'eventLog']);

  app.locals.connection.push( {
    user: user,
    db: connection
  });
}

module.exports = {
  getConnection: getConnection
};
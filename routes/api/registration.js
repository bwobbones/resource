var crypto = require('crypto');
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var dbDriver = require('../database')
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var jwt = require('jsonwebtoken');
var async = require('async');
var _ = require('lodash');
var login = require('./login');

var express = require('express');
var router = express.Router();
var Docker = require('dockerode');
var docker = new Docker();
var db;

router.post('/register', function (req, res, callback) {
  router.registerUser(req, res, callback);
});

router.registerUser = function (req, res, callback) {

  var username = req.body.username;
  var password = req.body.password;

  console.log('registering for ' + username + ' ' + password);

  async.waterfall([
    createTheMongoContainer,
    startTheContainer,
    connectToTheUserDatabase,
    addTheNewUserToTheContainer,
    encryptTheNewUserPassword
  ], function (err, user) {

    if (err) {
      console.log(err);
    } else {
      var token = jwt.sign(user, process.env.SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });

      // return the information including token as JSON
      user.password = undefined;
      user.confirm = undefined;

      res.json({
        success: true,
        token: token,
        user: user
      });
    }
  });

  function createTheMongoContainer(callback) {
    var container = docker.getContainer('mongo' + username);
    container.inspect(function (err, data) {
      if (!_.isNil(err)) {
        console.log(err);
      }

      if (!data) {
        docker.createContainer({ Image: 'mongo', NetworkMode: 'resource-net', name: 'mongo' + username, HostConfig: { PortBindings: { '27017/tcp': [{ HostPort: '27017' }] } } }, function (err, container) {
          if (!_.isNil(err)) {
            console.log(err);
          }

          console.log('created the container');
          callback(null, container);
        });
      } else {
        callback(null, container);
      }
    });
  }

  function startTheContainer(container, callback) {
    container.inspect(function (err, data) {
      if (!_.isNil(err)) {
        console.log(err);
      }

      if (data && data.State.Status !== 'running') {
        container.start(function (err, startedContainer) {
          if (!_.isNil(err)) {
            console.log(err);
          }
          console.log('started the container');
          callback(null, container);
        });
      } else {
        console.log('container is already running');
        callback(null, container);
      }
    });
  }

  function connectToTheUserDatabase(container, callback) {
    setTimeout(function() {
      db = dbDriver.connectUser('mongodb://mongo:27017/minhr');
      console.log('connected to the user database');
      callback(null, db);
    }, 3000);
  }

  function addTheNewUserToTheContainer(db, callback) {
    db.users.findAndModify({
      query: { username: username },
      update: { $set: req.body },
      new: true,
      upsert: true
    }, function (err, user, lastError) {
      if (err) {
        log.error("error! " + err.stack);
        return res.status(500).json({ error: 'Error editing' });
      }
      console.log('added the user');
      callback(null, user);
    });
  }

  function encryptTheNewUserPassword(user, callback) {
    login.resetPassword({ body: { password: user.password, username: user.username } }, { json: function () { } }, function () {
      console.log('password encryped');
      callback(null, user);
    });
  }

  // function loginTheNewUser(user, callback) {
  //   login.login({body: { password: user.password, username: user.username } }, { json: function() {}}, function() {
  //     console.log('password encryped');
  //     callback(null, user);
  //   });
  // }

};


module.exports = router;
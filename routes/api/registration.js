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

  async.waterfall([
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

  function connectToTheUserDatabase(callback) {
    db = dbDriver.getConnection(username);
    callback(null, db);
  }

  function addTheNewUserToTheContainer(db, callback) {

    delete req.body.confirm;

    req.db.users.findAndModify({
      query: { username: username },
      update: { $set: req.body },
      new: true,
      upsert: true
    }, function (err, user, lastError) {
      if (err) {
        log.error("error! " + err.stack);
        return res.status(500).json({ error: 'Error editing' });
      }
      callback(null, user);
    });
  }

  function encryptTheNewUserPassword(user, callback) {
    login.resetPassword({ body: { password: user.password, username: user.username } }, { json: function () { } }, function () {
      callback(null, user);
    });
  }

};


module.exports = router;
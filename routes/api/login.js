var crypto = require('crypto');
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var dbDriver = require('../database');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, callback) {
  router.loginUser(req, res, callback);
});

router.loginUser = function (req, res, callback) {

  var db = dbDriver.getConnection(req.body.username);

  db.users.findOne({ username: req.body.username }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      encryptPassword(req.body.password, user.salt, (err, encrypted) => {
        // check if password matches
        if (encrypted !== user.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });

          // return the information including token as JSON, with passwords removed
          user.password = undefined;
          user.confirm = undefined

          res.json({
            success: true,
            token: token,
            user: user
          });
        }

        if (callback) {
          callback();
        }
      });
    }
  });
};

router.post('/resetPassword', function (req, res, callback) {
  router.resetPassword(req, res, callback);
});

router.resetPassword = function (req, res, callback) {

  var db = dbDriver.getConnection(req.body.username);

  makeSalt((saltErr, salt) => {
    if (saltErr) {
      log.err('Got error while creating salt');
      return res.json(false);
    }

    encryptPassword(req.body.password, salt, (err, encrypted) => {
      if (err) {
        log.err('Could not encrypt password');
        return res.json(false);
      }
      
      db.users.findAndModify({
        query: {
          username: req.body.username
        },
        update: { 
          $set: { 
            password: encrypted, 
            salt: salt
          }
        },
        new: true
      }, function (err, doc) {
        if (err) {
          log.err("Error setting password: " + err);
          return res.json(false);
        }
        res.json(doc);
        callback();
      });
    });
  });
};

/**
 * Make salt
 *
 * @param {Number} byteSize Optional salt byte size, default to 16
 * @param {Function} callback
 * @return {String}
 * @api public
 */
function makeSalt(byteSize, callback) {
  var defaultByteSize = 16;
  
  if (typeof arguments[0] === 'function') {
    callback = arguments[0];
    byteSize = defaultByteSize;
  } else if (typeof arguments[1] === 'function') {this
    callback = arguments[1];
  }

  if (!byteSize) {
    byteSize = defaultByteSize;
  }

  if (!callback) {
    return crypto.randomBytes(byteSize).toString('base64');
  }

  return crypto.randomBytes(byteSize, (err, salt) => {
    if (err) {
      callback(err);
    } else {
      callback(null, salt.toString('base64'));
    }
  });
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @param {String} salt
 * @param {Function} callback
 * @return {String}
 * @api public
 */
function encryptPassword(password, salt, callback) {
  if (!password || !salt) {
    return null;
  }

  var defaultIterations = 10000;
  var defaultKeyLength = 64;
  var salt = new Buffer(salt, 'base64');

  if (!callback) {
    return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')
      .toString('base64');
  }

  return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
    if (err) {
      callback(err);
    } else {
      callback(null, key.toString('base64'));
    }
  });
}

router.get('/users', function (req, res, callback) {
  router.users(req, res, callback);
});


router.users = function (req, res, callback) {
  req.db.users.find({}, { username: 1, fullname: 1 }, function (err, docs) {
    if (err) {
      log.error(err);
    } else {
      res.json({
        users: docs
      });
    }
    callback();
  });
};

// login
function validPassword(user, password) {
  return user.password === password;
}


module.exports = router;
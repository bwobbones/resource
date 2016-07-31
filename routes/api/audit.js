
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;

var express = require('express');
var router = express.Router();

router.post('/logEvent', function(req, res, callback) { 
  router.logEvent(req, res, callback);
}); 

router.logEvent = function(req, res, callback) {
  req.body.logTime = new Date();
  req.db.eventLog.save(req.body);
  res.json(req.body);
  callback();
};

module.exports = router;

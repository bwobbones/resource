var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;

var path = require('path');
var personnel = require( path.resolve( __dirname, "./personnel.js" ) );

var express = require('express');
var router = express.Router();

router.get('/jobDescriptions', function(req, res, callback) {
  router.jobDescriptions(req, res, callback);
});
router.get('/jobDescription/:id', function(req, res, callback) {
  router.jobDescription(req, res, callback);
});
router.post('/jobDescription', function(req, res, callback) {
  router.saveJobDescription(req, res, callback);
});
router.post('/jobDescription/:id', function(req, res, callback) {
  router.saveJobDescription(req, res, callback);
});
router.delete('/jobDescription/:id', function(req, res, callback) {
  router.deleteJobDescription(req, res, callback);
});

// job
router.jobDescriptions = function(req, res, callback) {
  
  var searchKey = req.params.searchKey || req.param("searchKey") || '';
  
  var query = { $or: [
        {'company': { $regex: '.*' + searchKey + '.*', $options: 'i' } },
        {'position': { $regex: '.*' + searchKey + '.*', $options: 'i' } },
      ]};
  
  var finder = req.db.jobDescriptions.find(query, function(err, docs) {
    if (err) {
      log.error("error! " + err.stack);
    } else {
      res.json({
        jobDescriptions: docs
      });
      return finder;
      callback();
    }
  });

};

// job
router.jobDescription = function(req, res, callback) {
  var id = personnel.fixId(req.params.id);

  var finder = req.db.jobDescriptions.find({
    "_id": id
  }, function(err, doc) {
    if (err) {
      log.error("error! " + err.stack);
    } else {
      if (doc.length > 0) {
        res.json(doc[0]);
      } else {
        res.json(doc);
      }
      return finder;
      callback();
    }
  });
};
// job
router.saveJobDescription = function(req, res, callback) {

  var jobDescriptionQuery;
  if(req.body._id !== undefined) {
    jobDescriptionQuery = {'_id': personnel.fixId(req.body._id)};
    req.body._id = personnel.fixId(req.body._id);
  } else {
    jobDescriptionQuery = req.body;
  }

  var saver = req.db.jobDescriptions.findAndModify({
    query: jobDescriptionQuery,
    update: req.body,
    upsert: true,
    new: true
  }, function(err, doc) {
    if (err) {
      log.error("error! " + err.stack);
      return res.json(500, { error: 'Error editing' });
    }
    res.json(doc);
    return saver;
    callback();
  });

};

// job
router.deleteJobDescription = function(req, res, callback) {
  req.db.jobDescriptions.remove({
    "_id": personnel.fixId(req.params.id)
  }, function(err, doc) {
    if (err) {
      log.error("error! " + err.stack);
      return res.json(false);
    }
    res.json(true);
  });
};


module.exports = router;


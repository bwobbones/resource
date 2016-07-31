var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var path = require('path');
var personnel = require("./personnel");

var _ = require('lodash');
var gridjs = require('gridjs');

var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  requestTimeout: 3600000,
  log: 'trace'
});

winston.loggers.add('normal', {
  console: {
    level: 'info',
    colorize: true,
    label: moment().format("DD/MM/YYYY h:mm:ss")
  }
});

winston.loggers.add('performance', {
  console: {
    level: 'error'
  },
  file: {
    filename: 'performance.log',
    level: 'debug',
    colorize: true,
    label: 'performance'
  }
});

var log = winston.loggers.get('normal');
var performanceLog = winston.loggers.get('performance');

var ObjectId = mongojs.ObjectId;
var successReturnCode = 200;
var errorReturnCode = 500;

var now = require('performance-now');

// search
router.post('/searchPersonnel', function(req, res, callback) { 
  router.searchPersonnel(req, res, callback);
}); 

router.searchPersonnel = function(req, res, callback) {
// var docs;
  var andList = [];
  var orList = [];
  var inExperienceList = [];

  try {

    if (req.body.personnelName) {
      andList.push({ $or: [
        {'surname': { $regex: '.*' + req.body.personnelName + '.*', $options: 'i' } },
        {'name': { $regex: '.*' + req.body.personnelName + '.*', $options: 'i' } },
      ]});
    }

    if (req.body.similarPosition) {
      andList.push({ 'roles.roleName': { $regex: '.*' + req.body.similarPosition + '.*', $options: 'i' } });
    }

    if (req.body.eeha) {
      inExperienceList.push('eeha');
    }

    if (req.body.offshore) {
      inExperienceList.push('offOG');
    }

    if (req.body.occupation) {
      andList.push({ 'occupation': { $regex: '.*' + req.body.occupation + '.*', $options: 'i' } });
    }

    if (inExperienceList.length > 0) {
      andList.push({ 'roles.projects.projectExperience': { $in: inExperienceList } });
    }

    if (req.body.qualifications) {
      _.each(req.body.qualifications, function(qualification) {
        andList.push({ 'qualifications.name': { $regex: '.*' + qualification.name + '.*', $options: 'i' } });
      });
    }

    var keywordSearchType = 'AND';
    if (req.body.searchAll) {
      keywordSearchType = 'OR';
    }

    if (req.body.keywords) {
    //  var start = now();
      client.search({
        index: 'personnel',
        size: 500,
        defaultOperator: keywordSearchType,
        q: req.body.keywords
      }, function (error, response) {
       // var end = now();
        performanceLog.info('es search timing:');
        if (error) {
          log.error(error.stack);
        } 

        var documentPersonnel = [];
        _.each(response.hits.hits, function(hit) { 
          if (hit._source.personnelId) {
            documentPersonnel.push(personnel.fixId(hit._source.personnelId));
          }
        });
        documentPersonnel = _.uniq(documentPersonnel);
        andList.push({_id: { $in: documentPersonnel } });

        var startQuery = now();
        executeSearchQuery(req, res, callback, orList, andList);
        var endQuery = now();
        performanceLog.info('whole search timing: ' + (endQuery-startQuery).toFixed(3));

      });
    } else {
      var startQuery = now();
      executeSearchQuery(req, res, callback, orList, andList);
      var endQuery = now();
      performanceLog.info('normal search timing: ' + (endQuery-startQuery).toFixed(3));
    }

  } catch (err) {
    log.error(err.stack);
  }

};

// search
function executeSearchQuery(req, res, callback, orList, andList) {
  var orString;
  if (orList.length !== 0) {
    orString = { $or: orList };
    andList.push(orString);
  }

  var query = { $and: andList };
  if (andList.length !== 0) {

    // make sure not to include deleted personnel in the results
    andList.push({ deleted: { $ne: true } });

    // log.info(JSON.stringify(query));

    req.db.personnels.find(query, function(err, docs) {
      if (err) {
        log.error("error! " + err.stack);
      } else {
        res.json({
          personnels: docs
        });
        callback();
      }
    });

  } else {
    var emptyArray = [];
    res.json({
      personnels: emptyArray
    });
    callback();
  }  
}

module.exports = router;




var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var dbDriver = require('../database')
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
// typeahead

var express = require('express');
var router = express.Router();
var db = dbDriver.connectDefault();

router.get('/typeAheadFieldData', function(req, res, callback) { 
  router.typeAheadFieldData(req, res, callback);
});

router.typeAheadFieldData = function(req, res, callback) {

  var fieldName = req.params.fieldName || req.param("fieldName");
  var searchKey = req.params.searchKey || req.param("searchKey");
  if (!searchKey) searchKey = "";
  var searchKeyArray = searchKey.split(/\b\s+/);
  var searchKeyRegex = searchKeyArray.join('.*');
  var matcher = { $regex: '.*' + searchKeyRegex + '.*', $options: 'i' };

  var aggregateQuery = {
    'roleName': [
          { "$unwind": "$roles" },
          { "$group": { "_id" : "$roles.roleName" } },
          { "$project" : { "roleName": "$_id" } },
          { "$match": { "roleName": matcher } },
          { "$sort" : { "roleName" : 1 } }
        ],
    'projects': [
          { "$unwind": "$roles" },
          { "$unwind": "$roles.projects" },
          { "$group": { "_id" : "$roles.projects.text" } },
          { "$project" : { "text": "$_id" } },
          { "$match": { "text": matcher } },
          { "$sort" : { "text" : 1 } }
        ],        
    'client': [ 
          { "$unwind": "$roles" },
          { "$group": { "_id" : "$roles.client" } },
          { "$project" : { "client": "$_id" } },
          { "$match": { "client": matcher } },
          { "$sort" : { "client" : 1 } }
        ],
    'qualification': [ 
          { "$unwind": "$qualifications" },
          { "$group": { "_id" : "$qualifications.name" } },
          { "$project" : { "name": "$_id" } },
          { "$match": { "name": matcher } },
          { "$sort" : { "name" : 1 } }
        ],
    'training': [ 
          { "$unwind": "$trainings" },
          { "$group": { "_id" : "$trainings.name" } },
          { "$project" : { "name": "$_id" } },
          { "$match": { "name": matcher } },
          { "$sort" : { "name" : 1 } }
        ],
    'institution': [ 
          { "$unwind": "$trainings" },
          { "$group": { "_id" : "$trainings.institution" } },
          { "$project" : { "institution": "$_id" } },
          { "$match": { "institution": matcher } },
          { "$sort" : { "institution" : 1 } }
        ],
    'personnelName': [
          { "$project": { _id:0, personnelName: { $concat: [ "$name", " ", "$surname"] }, deleted:1 } },
          { "$match": { "deleted": { $ne: true } } },
          { "$match": { "personnelName": matcher } },
          { "$sort": { "personnelName": 1 } }
        ],
  };
  
  db.personnels.aggregate(aggregateQuery[fieldName], function(err, docs) {
    if (err) {
      log.error(err);
    } else {
      res.json({
        typeAheadData: docs
      });
    }
    callback();
  });  

};

module.exports = router;
var _ = require('lodash');
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var dbDriver = require('../database')
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var async = require('async');
var path = require('path');
var personnel = require( path.resolve( __dirname, "./personnel.js" ) );
var express = require('express');
var router = express.Router();

router.get('/manageWorkflow/:id', function(req, res, callback) { 
  router.manageWorkflow(req, res, callback);
}); 

// workflow
router.manageWorkflow = function(req, res, workflowCallback) {

  async.waterfall([

    function(callback) {
      req.db.jobDescriptions.findOne({_id: personnel.fixId(req.params.id)}, function(err, jobDescription) {

        if (!jobDescription) {
          jobDescription = {
            personnels: []
          }
        }

        callback(null, jobDescription);
      });
    },
    function(jobDescription, callback) {

      var personnelData = [];

      var count = 0;
      async.whilst(
        function () { return jobDescription.personnels && count < jobDescription.personnels.length; },
        function (callback) {

            var buildContactDetails = function(personnel) {
              return {
                mobile: personnel.hcmobile,
                home: personnel.hchomephone,
                email: personnel.hcemail
              };
            };

            var jobDescriptionPersonnel = jobDescription.personnels[count];
            req.db.personnels.findOne({_id: personnel.fixId(jobDescriptionPersonnel._id)}, function(err, personnel) {

              // these fields are merged with the jobdescription, but not saved with it
              var personnelInfo;
              personnelInfo = {
                _id: jobDescriptionPersonnel._id,
                contactDetails: buildContactDetails(personnel),
                availabledate: personnel.availabledate,
                dateofbirth: personnel.dateofbirth,
                preferredname: personnel.preferredname,
                referrer: personnel.referrer,
                project: personnel.project,
                currentlyemployed: personnel.currentlyemployed,
                noticeperiod: personnel.noticeperiod,
                roles: personnel.roles,
                commLog: _.last(personnel.commLog, 5),
                commLogCount: personnel.commLog === undefined ? 0 : personnel.commLog.length,
                followup: [],
                followupCount: 0
              };

              _.each(personnel.commLog, function(commLog) {
                _.each(commLog.followup, function(followup) {
                  personnelInfo.followup.push(followup);
                  personnelInfo.followupCount++;
                });
              });

              personnelData.push(personnelInfo);

              count++;

              callback();
              
            }); 
        },
        function (err) {
          callback(null, personnelData, jobDescription);
        }
      );

    },
    function(personnelData, jobDescription, callback) {
      res.json({
        personnelData: personnelData,
        jobDescription: jobDescription
      });
      workflowCallback();
      return;
    }


  ]);

};

module.exports = router;


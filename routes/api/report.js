
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;

var express = require('express');
var router = express.Router();

router.post('/qualificationReport', function(req, res, callback) { 
  router.qualificationReport(req, res, callback);
}); 
// report
router.qualificationReport = function(req, res, callback) {

 // var docs;
  var qualifications = [];
  req.db.personnels.find(function(err, docs) {

    var onlyExpired = req.body !== undefined ? req.body.onlyExpired : false;

    if (err) {
      log.error("error! " + err.stack);
    } else {
      _.each(docs, function(doc) {
        _.each(doc.qualifications, function(qualification) {
          if (!onlyExpired) {
            qualifications.push({
              'qualificationName': qualification.name,
              'personnelName': doc.surname + ', ' + doc.name,
              'expiryDate': qualification.expiryDate,
              'certificateNumber': qualification.certificateNumber,
              'institution': qualification.institution
            });
          } else if (moment(qualification.expiryDate).isBefore(now)) {
            var now = moment();
            qualifications.push({
              'qualificationName': qualification.name,
              'personnelName': doc.surname + ', ' + doc.name,
              'expiryDate': qualification.expiryDate,
              'certificateNumber': qualification.certificateNumber,
              'institution': qualification.institution
            });
          }
        });
      });

      var quals = _.sortBy(qualifications, function(qual) {
        return moment(qual.expiryDate);
      });

      res.json(quals);
    }
    callback();
  });

};

module.exports = router;

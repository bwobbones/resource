var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var gridjs = require('gridjs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  requestTimeout: 3600000,
   log: 'trace'
});

var express = require('express');
var router = express.Router();


router.get('/indexFiles', function(req, res, callback) {
  router.indexFiles(req, res, callback);
  res.send('indexed');
});

/**
 * A support function to push all files through elastic search indexing
 *
 * Used to aid a situation where the indexes are corrupted or such
 *
 * @param req
 * @param res
 */
// util
router.indexFiles = function(req, res) {

  req.db.personnels.find(function(err, personnels) {

    _.each(personnels, function(personnel) {
      if (personnel.files && personnel.files.length > 0) {
        _.each(personnel.files, function(file) {
          gs.read(file.fileId, function(err, buffer) {
            if (buffer) {
              _.defer(file.indexFile, buffer.toString('base64'), file.fileId, personnel._id);
            }
          });
        });
      }
    });

  });
};
function indexFile(data, fileId, personnelId) {

  var args = {
    content: data,
    personnelId: personnelId
  };

  client.index({
    index: 'personnel',
    type: 'document',
    id: fileId,
    refresh: true,
    body: args
  }, function (error) {
    if (error) {
      log.error("error! " + error.stack);
    }
  });

}

module.exports = router;

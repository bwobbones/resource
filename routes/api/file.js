
var _ = require('lodash');
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var db = require('../database')
var path = require('path');
var gridjs = require('gridjs');
var moment = require('moment');
var util = require("./util");
var ObjectId = mongojs.ObjectId;

var temp = require('temp');
var fs = require('fs');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  requestTimeout: 3600000
});

var express = require('express');
var router = express.Router();

var errorReturnCode = 500;
var successReturnCode = 200;

router.post('/uploadFile', function (req, res, callback) {
  router.uploadFile(req, res, callback);
});

router.uploadFile = function (req, res, callback) {

  var uploadDir = req.files.file.path.slice(0, req.files.file.path.lastIndexOf(path.sep));
  var uploadFile = req.files.file.path.slice(req.files.file.path.lastIndexOf(path.sep) + 1);

  var fileuploader = require('fileupload').createFileUpload(uploadDir);

  fileuploader.get(uploadFile, function (error, data) {

    if (error) {
      log.error("error! " + error.stack);
      res.json(errorReturnCode);
    }

    var gs = gridjs(req.db);
    gs.write(req.body.fileName, data, function (err) {
      if (err) {
        log.error("error! " + err.stack);
        res.json(errorReturnCode);
      }
      fs.readFile(uploadDir + "/" + uploadFile, function (error, data) {
        if (error) {
          log.error("error! " + error.stack);
          res.json(errorReturnCode);
        }
        res.json(successReturnCode);
        //indexFile( data.toString('base64'), req.body.fileId, req.body.personnelId );
      });
    });

    callback();

  });

}

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

router.post('/downloadFile', function (req, res, callback) {
  router.downloadFile(req, res, callback);
});

// file
router.downloadFile = function (req, res, callback) {
  var gs = gridjs(req.db);
  var reader = gs.read(req.body.fileId, function (err, buffer) {
    temp.open('minhr', function (err, tmpDownload) {
      if (!_.isNil(err)) {
        log.error(err.stack);
      }
      console.log(tmpDownload.path);
      fs.writeFile(tmpDownload.path, buffer, function () {
        fs.close(tmpDownload.fd, function (err) {
          if (!_.isNil(err)) {
            log.error(err.stack);
          }
          res.download(tmpDownload.path, req.body.fileName, function (err) {
            if (!_.isNil(err)) {
              console.log(err.stack);
            }
            // temp.cleanup();
          });
          return reader;
          callback();
        });
      });
    });
  });

};


module.exports = router;
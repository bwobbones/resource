var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var fs = require('fs');
var Docxtemplater = require('docxtemplater');

var express = require('express');
var router = express.Router();

router.post('/generatecv', function(req, res, callback) { 
  router.generatecv(req, res, callback);
}); 

// generateCV
router.generatecv = function(req, res, callback) {

  var personnel = req.body;

  var content = fs.readFileSync('templates/template.docx', 'binary');
 
  var doc = new Docxtemplater(content);
  doc.setData(personnel);
  doc.render();
  var buf = doc.getZip().generate({type:"nodebuffer"});

  res.statusCode = 200;
  res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(buf);

  callback();
};

module.exports = router;
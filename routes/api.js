var mongojs = require('mongojs');
var db = require('./database');
var _ = require('lodash');
var gridjs = require('gridjs');
var path = require('path');
var temp = require('temp');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var Docxtemplater = require('docxtemplater');
var now = require('performance-now');
var jwt = require('jsonwebtoken')
var winston = require('winston');

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

temp.track();


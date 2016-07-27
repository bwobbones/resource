var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var db = require('../database')
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
var winston = require('winston');
var _ = require('lodash');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var dbDriver = require('../database')
var moment = require('moment');
var ObjectId = mongojs.ObjectId;
 var callback = function() {
   // noop
 };

 var db = dbDriver.connectDefault();

//eval(fs.readFileSync('apicommon.js')+'');
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

var express = require('express');
var router = express.Router();

// search
/*
router.post('/searchPersonnel', function(req, res) { 
  router.searchPersonnel(req, res);
}); 
*/


// personnel
router.get('/personnels', function (req, res) {
  router.personnels(req, res, callback);
});


router.personnels = function (req, res, callback) {
  // var docs;
  db.personnels.find({ deleted: { $ne: true } }, function (err, docs) {
    if (err) {
      log.error(err);
    } else {
      res.json({
        personnels: docs
      });
    }
    callback();
  });

};

// personnel
router.get('/personnelsNameOnly', function (req, res) {
  router.personnelsNameOnly(req, res, callback);
});

router.personnelsNameOnly = function (req, res, callback) {

  // var docs;
  db.personnels.find({ deleted: { $ne: true } }, { name: 1, surname: 1 }, function (err, docs) {
    if (err) {
      log.error(err);
    } else {
      res.json({
        personnels: docs
      });
    }
    callback();
  });
};

// personnel

router.get('/personnel/:id', function (req, res) {
  router.personnel(req, res,callback);
});

router.personnel = function (req, res, callback) {
  var id = router.fixId(req.params.id);

  db.personnels.find({
    "_id": id
  }, function (err, doc) {
    if (err) {
      log.error("error! " + err.stack);
    } else {
      if (doc.length > 0) {
        res.json(doc[0]);
      } else {
        res.json(doc);
      }
    }
    callback();
  });
};


// personnel
router.post('/personnel', function (req, res) {
  router.addPersonnel(req, res, callback);
});

router.addPersonnel = function (req, res, callback) {

  db.personnels.findAndModify({
    query: { _id: new ObjectId() },
    update: { $set: req.body },
    new: true,
    upsert: true
  }, function (err, doc, lastError) {
    if (err) {
      log.error("error! " + err.stack);
      return res.json(500, { error: 'Error editing' });
    }
    res.json(doc);
    callback();
  });

};

// personnel
router.post('/personnel/:id', function (req, res) {
  router.updatePersonnel(req, res, callback);
});

router.updatePersonnel = function (req, res, callback) {

  var personnelId = _.clone(req.body._id);
  delete req.body._id;

  db.personnels.findAndModify({
    query: { _id: new ObjectId(personnelId) },
    update: { $set: req.body },
    new: true
  }, function (err, doc, lastError) {
    if (err) {
      log.error("error! " + err.stack);
      return res.json(500, { error: 'Error editing' });
    }
    res.json(doc);
    callback();
  });

};

// personnel
router.delete('/personnel/:id', function (req, res) {
  router.deletePersonnel(req, res, callback);
});

router.deletePersonnel = function (req, res, callback) {
  db.personnels.update({
    "_id": router.fixId(req.params.id)
  },
    {
      $set: { "deleted": true }
    }, function (err, doc) {
      if (err) {
        log.error("error! " + err.stack);
        return res.json(false);
      }
      res.json(doc);
      callback();
    });
};

// personnel
router.restorePersonnel = function (req, res, callback) {
  db.personnels.update({
    "_id": router.fixId(req.params.id)
  },
    {
      $unset: { "deleted": true }
    }, function (err, doc) {
      if (err) {
        log.error("error! " + err.stack);
        return res.json(false);
      }
      res.json(doc);
      callback();
    });
};

// personnel
router.reallyDeletePersonnel = function (req, res, callback) {
  db.personnels.remove({ _id: req.params.id }, true, function (err, doc) {
    if (err) {
      log.error("error! " + err.stack);
      return res.json(false);
    }
    res.json(doc);
    callback();
  });
}


/** 
  this is a temporary measure.  The ObjectId method is required for 
  the live system, but non-ObjectId is required by the tests in apispec
  need to look at having OIDs in the test cases I suspect
 */
// personnel
router.fixId = function (badId) {
  var goodId;
  if (badId && badId.length > 10) {
    goodId = ObjectId(badId);
  } else {
    goodId = badId;
  }
  return goodId;
}


module.exports = router;
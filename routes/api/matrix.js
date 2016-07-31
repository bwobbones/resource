var _ = require('lodash');
var winston = require('winston');
var log = winston.loggers.get('normal');
var mongojs = require('mongojs');
var moment = require('moment');
var ObjectId = mongojs.ObjectId;

var express = require('express');
var router = express.Router();
var db = dbDriver.getConnection();
//router.get('/personnelPairings', router.personnelPairings, callback);

router.get('/personnelPairings', function(req, res, callback) { 
  router.personnelPairings(req, res, callback);
});

router.post('/assembleProjectTeamData', function(req, res, callback) {
  router.assembleProjectTeamData(req, res, callback);
});

// matrix
router.assembleProjectTeamData = function(req, res, callback) {

  var assembledData = {
    projects: [],
    personnel: []
  }

  req.db.personnels.find(function(err, personnels) {

    if (err) {
      log.error("error! " + err.stack);
    } else {
      _.each(personnels, function(personnel) {
        if (!personnel.deleted) {

          var storedPersonnel = {
            id: personnel._id,
            name: personnel.name + ' ' + personnel.surname,
            occupation: personnel.occupation || 'Unknown',
            roles: personnel.roles
          };

          _.each(personnel.roles, function(role) {
            _.each(role.projects, function(project) {

              if (!project.projectExperience || project.projectExperience.length === 0) {
                project.projectExperience = ['other'];
              }

              _.each(project.projectExperience, function(experience) {
                var thisProject = _.find(assembledData.projects, { name: project.text, projectExperience: experience });
                if (!thisProject) {
                  assembledData.projects.push({ id: new ObjectId(), name: project.text, personnel: [ storedPersonnel], projectExperience: experience });
                } else {
                  thisProject.personnel.push(storedPersonnel);
                }
              });

            });
          });

          assembledData.personnel.push(storedPersonnel);
        }

      });
    }

    res.json({
      teamProjectData: assembledData
    });    
    callback();

  });

}

// matrix
router.personnelPairings = function(req, res, callback) {

 // var docs;
  req.db.personnels.find(function(err, docs) {

    var nodeValues = [];
    var linkValues = [];

    if (err) {
      log.error("error! " + err.stack);
    } else {

      // for each role in personnel, find the number of other people that have
      // worked at the same location
      // name = personnelName
      // group = location
      var pairings = {};
      var people = {};
      var projects = [];
      var index = 0;
      var uniqueProjects = [];
      docs.forEach(function(personnel) {

        people[personnel._id] = {
              "name": personnel.name,
              "sortId": index
            };

        index++;

        if (personnel.roles) {
          personnel.roles.forEach(function(role) {
            if (!pairings[role.project]) {
              pairings[role.project] = [personnel._id];
            } else {
              pairings[role.project].push(personnel._id);
            }
            projects.push(role.project);
          });
        }
      });
      uniqueProjects = _.uniq(projects);

      Object.keys(pairings).forEach(function(project) {
        var firstLink = pairings[project][0];
        pairings[project].forEach(function(personId) {          
          // don't add a link to myself
          if (firstLink !== personId) {
            linkValues.push({
              "source": people[firstLink].sortId,
              "target": people[personId].sortId,
              "value": "1"
            });
          }
        });
      });

      //dedupe the nodeValues
      docs.forEach(function(personnel) {
        var thisNode = {
            "name": people[personnel._id].name,
            //"group": uniqueLocations.indexOf(location)
            "group": "1"
          };

          nodeValues.push(thisNode);
      });

      res.json({
        nodes: nodeValues,
        links: linkValues
      });

    }

  }).sort({
    name: 1
  });
};

module.exports = router;
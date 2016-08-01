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

router.get('/skillsMatrix', function (req, res) {
  db.personnels.find((err, personnels) => {
    if (err) {
      log.error(err);
      res.sendStatus(500);
      return;
    }
    personnels = _.filter(personnels, p => !p.deleted);
    personnels.sort();

    var names = [];
    var skillsByType = {
      'Roles': {},
      'Qualifications': {},
      'Training': {},
    };
    for (var personnel of personnels) {
        for (var role of personnel.roles) {
          addSkill(role.roleName, skillsByType['Roles'], names.length);
        }
        for (var qualification of personnel.qualifications) {
          addSkill(qualification.name, skillsByType['Qualifications'], names.length);
        }
        for (var training of personnel.trainings) {
          addSkill(training.name, skillsByType['Training'], names.length);
        }
        names.push(personnel.name + ' ' + personnel.surname);
    }

    var data = [];
    var skills = [];
    for (var type of ['Roles', 'Qualifications', 'Training']) {
      var coords = [];
      _.forEach(skillsByType[type], (personnelIndicies, skill) => {
        for (var personnelIndex of personnelIndicies) {
          coords.push({x: skills.length, y: personnelIndex});
        }
        skills.push(skill);
      });
      data.push({
        name: type,
        x: _.map(coords, c => c.x),
        y: _.map(coords, c => c.y),
        mode: 'markers',
        type: 'scatter',
      });
    }

    res.json({
      data: data,
      layout: {
        xaxis: {
          tickvals: _.range(skills.length),
          ticktext: skills,
          zeroline: false,
          side: 'top',
        },
        yaxis: {
          tickvals: _.range(names.length),
          ticktext: names,
          gridwidth: 5,
          zeroline: false,
        },
        margin: {
          l: 150,
          t: 150,
          b: 0,
        },
        hovermode: 'closest',
      },
      config: {
        modeBarButtonsToRemove: ['hoverCompareCartesian'],
      },
    });
  });
});

function addSkill(skillName, skillsOfType, personnelIndex) {
  var entry = skillsOfType[skillName];
  if (entry === undefined) {
    entry = [];
    skillsOfType[skillName] = entry;
  }
  entry.push(personnelIndex);
}

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
var _ = require('lodash');
var winston = require('winston');
var log = winston.loggers.get('normal');

var express = require('express');
var router = express.Router();

router.get('/skillsMatrix', function (req, res) {
  req.db.personnels.find((err, personnels) => {
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
        if (personnel.roles) {
          for (var role of personnel.roles) {
            addSkill(role.roleName, skillsByType['Roles'], names.length);
          }
        }
        if (personnel.qualifications) {
          for (var qualification of personnel.qualifications) {
            addSkill(qualification.name, skillsByType['Qualifications'], names.length);
          }
        }
        if (personnel.trainings) {
          for (var training of personnel.trainings) {
            addSkill(training.name, skillsByType['Training'], names.length);
          }
        }
        var name = personnel.name;
        if (personnel.surname) {
          name += ' ' + personnel.surname;
        }
        names.push(name);
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
  if (skillName) {
    var entry = skillsOfType[skillName];
    if (entry === undefined) {
      entry = [];
      skillsOfType[skillName] = entry;
    }
    entry.push(personnelIndex);
  }
}

module.exports = router;
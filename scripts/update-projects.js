// usage: node update-projects.js [write]

var mongojs = require('mongojs');
var Baby = require('babyparse');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');

var updateLog = [];
var notUpdatedLog = [];

fs.readFile('/Users/bwobbones/Downloads/projectnames.csv', 'utf8', function (err, data) {
//fs.readFile('/Users/bwobbones/Downloads/localproj.csv', 'utf8', function (err, data) {

  if (err) {
    console.log(err);
    throw err;
  }
  parsed = Baby.parse(data);
  var rows = parsed.data;

  var db = mongojs('mongodb://192.168.22.5:27017/minhr', ['personnels']);
  //var db = mongojs('mongodb://mongo:27017/minhr', ['personnels']);

  async.each(rows, function(row, callback) {

    if (row[0] !== row[1]) {

      db.personnels.find(
        {
          roles: {
            $elemMatch: {
              projects: {
                $elemMatch: {text: row[0]}
              }
            }
          }
        }, function (err, personnels) {
          if (personnels.length === 0) {
            notUpdatedLog.push(row[0] + " - no personnel with this role");
          } else {
            _.each(personnels, function (personnel) {
              console.log('*** ' + row[0] + ' *** ' + personnel.surname + ' *** ' + row[1]);
              _.each(personnel.roles, function(role) {
                _.each(role.projects, function(project) {
                  if (project.text === row[0]) {
                    project.id = row[1];
                    project.text = row[1];
                    updateLog.push(personnel.name + " " + personnel.surname + " updated '" + row[0] + "' to '" + row[1] + "'");

                    if (process.argv[2] === 'write') {
                      console.log('updating personnel...');
                      db.personnels.update(
                        {_id: personnel._id},
                        personnel
                      );

                    }
                  }
                });
              });
            });
          }
          callback(null);
        });

    } else {
      callback(null);
    }

  }, function(err) {
    console.log('********************************** changes!');
    _.each(updateLog, function(logMsg) {
      console.log(logMsg);
    });
    console.log('********************************** no personnel!');
    _.each(notUpdatedLog, function(logMsg) {
      console.log(logMsg);
    });
    console.log('********************************** done!');
    db.close();
  });

});
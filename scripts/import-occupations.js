// usage: node import-occupations.js

var MongoClient = require('mongodb').MongoClient;
var Baby = require('babyparse');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');

var found = 0;
var called = 0;
var unfound = 0;
var removed = 0;

fs.readFile('/Users/bwobbones/Downloads/Insulators.csv', 'utf8', function (err, data) {
  if (err) {
    console.log(err);
    throw err;
  }
  parsed = Baby.parse(data);
  var rows = parsed.data;

  _.each(rows, function(row) {
    if (row[0].length <= 0) {
      removed = removed + 1;
    }
  });

  var done = _.after((rows.length - removed), function(db) {
    console.log('closing!');
    db.close();
  });

  MongoClient.connect("mongodb://192.168.22.4:27017/minhr", function(err, db) {
  //MongoClient.connect("mongodb://mongo:27017/minhr", function(err, db) {

      var personnel = db.collection('personnels');

      _.each(rows, function(row) {
        if (row[0].length > 0) {
          var splitName = row[0].trim().split(' ');
          var firstName = splitName[0];
          var surname = _.rest(splitName).join(' ');

          if (err) { console.log(err); }

          var personnelUpdates = {
            name: firstName,
            surname: surname,
            referrer: row[1],
            hchomephone: row[3],
            hcemail: row[4],
            occupation: 'Insulator'
          };

          personnel.findAndModify(
            {name: firstName, surname: surname, deleted: { $ne: true} },
            {},
            { $set: personnelUpdates },
            { upsert: true,
              new: true},
            function(err, doc) {
              if (err) {
                console.log("Error editing: " + err);
                console.log("Tried to update to: " + JSON.stringify(req.body));
                console.log(err.stack);
                return res.json(500, { error: 'Error editing' });
              }
              console.log(personnelUpdates);
              console.log(doc);
              done(db);
            });


          //personnel.findOne({name: firstName, surname: surname}, function(err, doc) {
          //  if (doc !== null) {
          //    found = found + 1;
          //    console.log('found: ' + doc.name + ' ' + doc.surname);
          //  } else {
          //    unfound = unfound + 1;
          //    console.log('couldnt find: ' + firstName);
          //  }
          //
          //  console.log('found: ' + found + ' unfound: ' + unfound);
          //  done(db);
          //
          //});

      };

    });
  });

});
// usage: node --max-old-space-size=3072 ./scripts/refresh-indexes.js
// best to be run on host server
// --max-old-space-size=3072 means give node more heap (3gb)

/**
 * A support function to push all files through elastic search indexing
 *
 * Used to aid a situation where the indexes are corrupted or such
 */

var _ = require('lodash');
var mongojs = require('mongojs');
var gridjs = require('gridjs');

var db = mongojs('mongodb://192.168.22.5:27017/minhr', ['personnels']);
var gs = gridjs(db);
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '192.168.22.5:9200',
  // log: [{
  //   levels: ['debug']
  // }],
  requestTimeout: 3600000
});

var count = 0;

db.personnels.find(function(err, personnels) {

  _.each(personnels, function (personnel) {
    if (personnel.files && personnel.files.length > 0) {
      console.log(personnel.name + ' ' + personnels[0].surname + ' - ' + personnel._id);
      _.each(personnel.files, function (file) {
        count = count + 1;
        console.log(file.fileName + ' ' + count);
        gs.read(file.fileId, function (err, buffer) {
          if (buffer) {
            indexFile(file.fileName, buffer.toString('base64'), file.fileId, personnel._id);
          }
        });
      });
    }
  });

});

function indexFile(fileName, data, fileId, personnelId) {

  console.log('indexing ' + fileName);

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
      console.log(error.stack);
    }
  });

}
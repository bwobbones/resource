// usage: mongo 192.168.22.4:27017/minhr export.js > ~/rolenames.csv

load('components/bower_components/moment/moment.js')
load('components/bower_components/lodash/lodash.js')

var invaliddates = [];
var validcount = 0;
var dobcount = 0;
var nodobcount = 0;

//print('checking:  ' + );

db.personnels.find({ deleted: { $ne: true} }).forEach(function(personnel){
//db.jobDescriptions.find({ deleted: { $ne: true } }).forEach(function(job) {


  _.each(personnel.trainings, function(training) {

    //var dateField = job.datecompleted;
    var dateField = training.expiryDate;

    if (dateField) {

      dobcount = dobcount + 1;

      //var date = correctSingleYear(personnel.roles[i][dateFields[j]]);
      //1989-06-24T16:00:00.000Z
      var parsedDate = moment(dateField, ['DD.MM.YY', 'DD.MM.YYYY', 'DD/MM/YYYY', 'D/M/YYYY', 'D/M/YY', 'D/MMM/YYYY', 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true);
      if (parsedDate.isValid()) {
        validcount = validcount + 1;
        var newDate = parsedDate.format('D/M/YYYY');

        print(dobcount + ': updating ' + dateField + ' with ' + newDate.toString());
        //job.datecompleted  = newDate;
        training.expiryDate = newDate;
        //db.jobDescriptions.update( {'_id': job._id }, job);
        db.personnels.update({'_id': personnel._id}, personnel);
        //print('.');

      } else {
        print('NOT VALID!' + personnel.surname + ' ' + personnel.name);
        //print('NOT VALID!' + job.company + ' ' + job.position);
        invaliddates.push(dateField);
      }

    } else {
      nodobcount = nodobcount + 1;
    }

  });

});


function correctSingleYear(date, personnel) {
  var components = date.split('/');
  if (components.length !== 3) {
    return date;
  } else {
    if (components[2].length === 1) {
      components[2] = '200' + components[2];
    }
    return components.join('/');
  }
}

print (dobcount + ' dates');
print (nodobcount + ' without dates');
print(validcount + ' valid dates');
print(invaliddates.length  + ' invalid dates');

_.each(invaliddates, function(date) {
  print(date);
});
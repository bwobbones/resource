/* globals appServices, JobDescriptionMissingMandatoryCtrl */
'use strict';

appServices.factory('JobDescriptionService', function($http, $rootScope, $filter, $modal,
  EventLogService, AlertService, HtmlifyDataService) {

  var jobDescriptionService = {

    save: function(jobDescription, form, personnelToUpdate) {

      if (jobDescription && form.$valid) {
        if (personnelToUpdate) {
          updateSelectedPersonnelData(jobDescription, personnelToUpdate);
        }

        var url = '/api/jobDescription';
        if (jobDescription._id) {
          url = url + '/' + jobDescription._id;
        }

        var promise = $http.post(url, jobDescription).
        success(function(data) {
          AlertService.add('success', jobDescription.position + ' saved for ' + jobDescription.company);

          try {
            form.$setPristine();
          } catch (err) {
            // it fails because the form is fake or non-existent (i.e. it's already pristine or it doesn't matter
          }

          return data;
        }).error(function(err) {
          AlertService.add('error', 'There was a problem editing, please notify support');
          console.log(err.stack);
        });

        return promise;
      } else {
        AlertService.add('error', 'All required fields are not filled correctly', 'Error!');
        return {
          then: function() {}
        };
      }
    },

    find: function(jobDescriptionId) {
      var promise = $http.get('/api/jobDescription/' + jobDescriptionId).success(function(data) {
        return data;
      });
      return promise;
    },

    reset: function(scope) {
      scope.form = {};
      scope.form.worktype = 'fulltime';
      scope.form.offshore = false;
      scope.form.status = 'open';
      var searchResult = {
        personnels: []
      };
    },

    findAll: function() {

      var promise = $http.get('/api/jobDescriptions').success(function(data) {
        return data;
      });
      return promise;

    }

    // remove: function(username, personnel) {
    //   var promise = $http.delete('/api/personnel/' + personnel._id).success(function(data) {
    //     $rootScope.$broadcast('personnelChangedEvent');
    //     EventLogService.log('personnel', username, personnel.name + ' ' + personnel.surname + ' (' + personnel._id + ') deleted');
    //     AlertService.add('success', personnel.name + ' ' + personnel.surname + ' deleted');
    //   });
    //   return promise;
    // }

  };

  function updateSelectedPersonnelData(jobDescription, personnelToUpdate) {
    _.each(jobDescription.personnels, function(personnel) {
      var foundPersonnel = _.find(personnelToUpdate, {
        _id: personnel._id
      });
      if (foundPersonnel) {
        personnel.acceptable = (foundPersonnel.acceptable === undefined || foundPersonnel.acceptable) ? true : false;
        personnel.currentWorkflow = foundPersonnel.currentWorkflow;
      }
    });
  }

  return jobDescriptionService;
});

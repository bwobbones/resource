/* globals appServices, moment, _ */
'use strict';

appServices.factory('PersonnelService', function ($http, $rootScope, $filter, $modal, EventLogService,
  AlertService, HtmlifyDataService) {

  var personnelService = {

    save: function (scope, personnel, form) {
      // form will be undefined in the case of a delete
      if (!form) {
        form = {};
        form.$valid = true;
      }


      if (form.$valid) {
        var url = '/api/personnel';
        if (personnel && personnel._id) {
          url += '/' + personnel._id;
        }

        var promise = $http.post(url, personnel).success(function (data) {

          // this checks to see if we can limit the event logged items to just the changes
          var output = personnel;
          if (form) {
            output = $filter('returnDirtyItems')(angular.copy(personnel), form);
          }

          EventLogService.log('personnel', $rootScope.user.username, personnel.name + ' ' + personnel.surname + ' edited', output);
          AlertService.add('success', (personnel.name || '') + ' ' + (personnel.surname || '') + ' saved');

          if (form) {
            try {
              form.$setPristine();
            } catch (err) {
              // it fails because the form is fake or non-existent (i.e. it's already pristine or it doesn't matter
            }
          }

          $rootScope.$broadcast('personnelChangedEvent', data._id);

          return data;

        }).error(function () {
          AlertService.add('error', 'There was a problem editing, please notify support');
        });
        return promise;
      } else {
        AlertService.add('error', 'All required fields are not filled correctly', 'Error!');
        return { then: function () { } };
      }
    },

    find: function (personnelId) {
      var promise = $http.get('/api/personnel/' + personnelId).success(function (data) {
        if (data && data.commLog) {
          HtmlifyDataService.htmlify(data.commLog);
        }
        return data;
      });
      return promise;
    },

    findAll: function () {

      var promise = $http.get('/api/personnels').success(function (data) {
        return data;
      });
      return promise;

    },

    findAllNameOnly: function () {
      var promise = $http.get('/api/personnelsNameOnly').success(function (data) {
        return data;
      });
      return promise;
    },

    remove: function (username, personnel) {
      var promise = $http.delete('/api/personnel/' + personnel._id).success(function () {
        $rootScope.$broadcast('personnelChangedEvent');
        EventLogService.log('personnel', username, personnel.name + ' ' + personnel.surname + ' (' + personnel._id + ') deleted');
        AlertService.add('success', personnel.name + ' ' + personnel.surname + ' deleted');
      });
      return promise;
    },

    // some terrible code here - rework after tests
    saveTraining: function (scope, personnelId, trainings) {
      this.find(personnelId).then(function (httpResult) {
        var personnel = httpResult.data;
        _.each(trainings, function (training) {
          var foundTraining;
          _.each(personnel.trainings, function (currentTraining) {
            if (_.isEqual(currentTraining._id, training._id)) {
              foundTraining = currentTraining;
            }
          });
          if (foundTraining) {
            personnel.trainings = _.without(personnel.trainings, foundTraining);
          }
          personnel.trainings.push(training);
        });
        personnelService.save(scope, personnel, { $valid: true });
      });
    },

    assembleProjectTeamData: function () {
      var promise = $http.post('/api/assembleProjectTeamData').success(function (data) {
        return data;
      });
      return promise;
    }

  };

  return personnelService;
});
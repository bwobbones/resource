/* global angularModules, JobDescriptionCtrl, DeleteJobDescriptionCtrl, moment, _ */
'use strict';

angularModules.config(function($stateProvider) {

  $stateProvider.state('jobDescription', {
      abstract: true,
      views: {
        'dataPanel': {
          templateUrl: 'partials/jobDescription/abstractJobDescription',
          controller: 'JobDescriptionCtrl',
        }
      }
    })
    .state('jobDescription.addJobDescription', {
      url: '/addJobDescription',
      views: {
        'dataPanel': {
          templateUrl: 'partials/jobDescription/addJobDescription',
        }
      },
      params: {
        personnel: null
      }
    })
    .state('jobDescription.editJobDescription', {
      url: '/jobDescription/:id',
      views: {
        'dataPanel': {
          templateUrl: 'partials/jobDescription/editJobDescription',
        }
      }
    });
});

angularModules.controller('JobDescriptionCtrl', ['$scope', '$rootScope', '$modal', '$state', 'JobDescriptionService',
  'TabService', 'TypeAheadService', '$stateParams', JobDescriptionCtrl
]);

function JobDescriptionCtrl($scope, $rootScope, $modal, $state, JobDescriptionService, TabService, TypeAheadService, 
  $stateParams) {

  $scope.tabPanes = TabService.getTabs('jobTabs');
  TabService.openRemembered('jobTabs');
  TabService.registerTabWatcher($scope, 'jobTabs');
  
  JobDescriptionService.findAll().then(function(httpResult) {
    $scope.jobDescriptions = httpResult.data.jobDescriptions;
  });
  
  setupJobDescription($state.params.id);

  function setupJobDescription(id) {
    if ($scope.pForm) {
      try {
        $scope.pForm.$setPristine();
      } catch (err) {
        // it fails because the form is fake or non-existent (i.e. it's already pristine or it doesn't matter
      }
    }

    if (id !== undefined) {
      JobDescriptionService.find(id).then(function(httpResult) {
        $scope.originalJob = angular.copy(httpResult.data);
        $scope.form = angular.copy(httpResult.data);
      });
    } else {
      $scope.originalJob = {};
      if ($scope.form !== undefined) {
        JobDescriptionService.reset($scope);
      } else {
        $scope.form = {};
      }
    }
  }

  var unbindStateChange = $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (toState.name === 'index' || toState.name === 'jobDescription.addJobDescription') {
      $scope.form = {};
    }

    if (toState.name.contains('jobDescription')) {
      setupJobDescription(toParams.id);
    }
    
    if (toState.name === 'jobDescription.addJobDescription') {
      $scope.jd = {};
      $scope.jd.jobDescriptionPersonnels = toParams.personnel;
      if (toParams.personnel) { 
        $scope.form.personnels = toParams.personnel;
      }
    }
    
  });
  $scope.$on('$destroy', unbindStateChange);

  $scope.openDeleteMessageBox = function() {

    $modal.open({
      templateUrl: 'partials/jobDescription/deleteJobDescription',
      controller: 'DeleteJobDescriptionCtrl',
      resolve: {
        position: function() {
          return $scope.form.position;
        },
        jobDescriptionId: function() {
          return $scope.form._id;
        }
      }
    });

  };

  var unbindAddCommLog = $scope.$on('updatedJobDescriptionChild', function(event, personnelMatchList) {
    JobDescriptionService.save($scope.form, $scope.pForm, personnelMatchList);
  });
  $scope.$on('$destroy', unbindAddCommLog);

  $scope.saveJobDescription = function() {
    JobDescriptionService.save($scope.form, $scope.pForm).then(function(httpResult) {
      if ($scope.pForm.$valid) {
        $scope.originalJob = angular.copy(httpResult.data);
        $state.transitionTo('jobDescription.editJobDescription', {
          id: httpResult.data._id
        });
      }
    });
  };

  $scope.typeAhead = function(field, value) {
    return TypeAheadService.query(field, value);
  };

  $scope.addQualification = function() {
    if ($scope.form === undefined) {
      $scope.form = {};
    }
    if ($scope.form.qualifications === undefined || $scope.form.qualifications.length === 0) {
      $scope.form.qualifications = [];
    }
    $scope.form.qualifications.push({});
  };

  $scope.deleteQualification = function(qualificationName) {
    var oldQualifications = $scope.form.qualifications;
    $scope.form.qualifications = [];
    _.each(oldQualifications, function(qualification) {
      if (qualification.name !== qualificationName) {
        $scope.form.qualifications.push(qualification);
      }
    });
  };
}

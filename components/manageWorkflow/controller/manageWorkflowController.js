/* globals angularModules, _, ManageWorkflowService, PersonnelService, JobDescriptionService */
'use strict';

angularModules.config(function ($stateProvider) {
  
  $stateProvider.state('manageWorkflow', {      
      url: '/manageWorkflow/:id',
      views: {
        'dataPanel': { templateUrl: 'partials/manageWorkflow/manageWorkflow', controller: ManageWorkflowCtrl}
      }
    });
});

angularModules.controller('ManageWorkflowCtrl', ['$scope', '$stateParams', '$rootScope', '$modal', '_', 
  'AlertService', 'ManageWorkflowService', 'PersonnelService', 'RoleService', 'FollowupService', 'JobDescriptionService', 
  ManageWorkflowCtrl]);

function ManageWorkflowCtrl($scope, $stateParams, $rootScope, $modal, _, AlertService, ManageWorkflowService,
  PersonnelService, RoleService, FollowupService, JobDescriptionService) {

  $scope.followupCollapsed;
  $scope.commLogCollapsed;

  if ($scope.jd && $scope.jd.jobDescriptionPersonnels) {
    $scope.mergedPersonnels = $scope.jd.jobDescriptionPersonnels;
    ManageWorkflowService.initialisePersonnel($scope);
    filterPersonnel();
    $scope.displayPersonnels = [].concat($scope.mergedPersonnels);
  } else {
    $scope.parentJobDescriptionId = $stateParams.id;
    ManageWorkflowService.refresh($scope).then(function() {
      filterPersonnel();
      $scope.displayPersonnels = [].concat($scope.mergedPersonnels);
    });
  }
  
  function filterPersonnel() {
    PersonnelService.findAll().then(function(httpResult) {
      $scope.allPersonnels = [];
      _.each(httpResult.data.personnels, function(personnel) {
        var currentMerged = _.pluck($scope.mergedPersonnels, '_id')
        if (!_.contains(currentMerged, personnel._id)) {
          $scope.allPersonnels.push(personnel);
        }
      });
    });
  }
  
  $scope.$on('updatedJobDescriptionChild', function(event, personnelMatchList) {
    saveJobDescription(personnelMatchList);
  });

  $scope.$on('commLogSavedEvent', function(event) {
    saveJobDescription();
  });

  function saveJobDescription(personnelMatchList, personnelToAdd) {
    JobDescriptionService.find($stateParams.id).then(function(job) {
      // form doesn't matter in this scenario
      $scope.pForm = {$valid: true};
      if (personnelToAdd) {
        if (!job.data.personnels) {
          job.data.personnels = [];
        }
        job.data.personnels.push(personnelToAdd);
      }
      JobDescriptionService.save(job.data, $scope.pForm, personnelMatchList).then(function(savedJob) {
        $scope.parentJobDescriptionId = job.data._id;
        ManageWorkflowService.refresh($scope).then(function() {
          $scope.displayPersonnels = [].concat($scope.mergedPersonnels);
        });
      });
    });
  }

  $scope.viewPersonnelModal = function(personnel) {
    var modalInstance = $modal.open({
      templateUrl : 'partials/manageWorkflow/viewPersonnel',
      controller : 'WorkflowPersonnelCtrl',
      size: 'lg',
      resolve : {
        personnelData : function() {
          return personnel;
        }
      }
    });
  };

  $scope.addCommLog = function(personnelId) {
    PersonnelService.find(personnelId).then(function(httpResult) {
      $scope.uncheckedPersonnel = httpResult.data;
      $modal.open({
        templateUrl : 'partials/commLog/commLog',
        controller : 'CommLogCtrl',
        size: 'lg',
        resolve : {
          personnelData : function() {
            return httpResult.data;
          },
          pForm : function() {
            return undefined;
          }
        }
      });
    });
  };

  $scope.updateFollowup = function(personnelId, followupId, followup, mergedPersonnel) {
    FollowupService.updateFollowup(personnelId, followupId, followup);
  }

  $scope.toggleFollowups = function(personnel) {
    if ($scope.followupCollapsed === personnel._id) {
      $scope.followupCollapsed = undefined;
    } else {
      $scope.followupCollapsed = personnel._id;
    }
  }

  $scope.toggleCommLogs = function(personnel) {
    if ($scope.commLogCollapsed === personnel._id) {
      $scope.commLogCollapsed = undefined;
    } else {
      $scope.commLogCollapsed = personnel._id;
    }
  }

  $scope.hasOverdueFollowups = function(personnel) {
    var hasOverdue = false;
    _.each(personnel.followup, function (followup) {
      if (followup.dateDue) {
        if (!followup.completed && moment(followup.dateDue, 'DD/MM/YYYY HH:mm').isBefore(moment())) {
          followup.overdue = true;
          hasOverdue = true;
        }
      }
    });

    return hasOverdue;
  }

  $scope.hasUnacceptable = function() {
    var hasUnacceptable = false;
    _.each($scope.mergedPersonnels, function (personnel) {
      if (!personnel.acceptable) {
        hasUnacceptable = true;
      }
    });
    return hasUnacceptable;
  }
  
  $scope.addPersonnel = function($item, $model, $label) {
    addPersonnelToWorkflow($item);
    collapseInput();
  }
  
  function addPersonnelToWorkflow(personnel) {    
    personnel.acceptable = true;
    $scope.mergedPersonnels.push(personnel);
    ManageWorkflowService.initialisePersonnel($scope);
    $scope.displayPersonnels = [].concat($scope.mergedPersonnels);
    saveJobDescription($scope.mergedPersonnels, personnel);    
    AlertService.add('success', (personnel.name || '') + ' ' + (personnel.surname || '') + ' added');
  }
  
  function collapseInput() {
    $scope.collapseAdd = !$scope.collapseAdd;
    $scope.personnelAdded = undefined;
  }
  
}



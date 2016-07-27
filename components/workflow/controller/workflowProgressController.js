/* exported WorkflowProgressCtrl */

angularModules.controller('WorkflowProgressCtrl', ['$scope', '$rootScope', '$modalInstance',
  '$interpolate', 'AlertService', 'PersonnelService', 'CommLogService', 'hotkeys', 'personnelData',
  'workflowStates', 'jobDescription', WorkflowProgressCtrl
]);

function WorkflowProgressCtrl($scope, $rootScope, $modalInstance, $interpolate, AlertService,
  PersonnelService, CommLogService, hotkeys, personnelData, workflowStates, jobDescription) {

  $scope.personnelData = personnelData;
  $scope.workflowStates = workflowStates;

  $scope.workflow = {};

  if (!personnelData.workflows) {
    personnelData.workflows = [];
  }

  $scope.currentWorkflowState = findState().state;
  var titleStr = $interpolate(findState().title);
  $scope.currentTitle = titleStr($scope);
  $scope.currentTemplate = findState().template;
  if (!personnelData.workflows[personnelData.currentWorkflow]) {
    personnelData.workflows[personnelData.currentWorkflow] = {};
  }
  $scope.personnelWorkflow = personnelData.workflows[personnelData.currentWorkflow];


  function findState() {
    return _.findWhere($scope.workflowStates, {
      'index': personnelData.currentWorkflow
    });
  }

  $scope.nextStateName = findNextStateName();
  $scope.previousStateName = findPreviousStateName();

  function findNextStateName() {
    return personnelData.currentWorkflow < $scope.workflowStates.length - 1 ?
      _.findWhere($scope.workflowStates, {
        'index': personnelData.currentWorkflow + 1
      }).state :
      undefined;
  }

  function findPreviousStateName() {
    return personnelData.currentWorkflow > 0 ?
      _.findWhere($scope.workflowStates, {
        'index': personnelData.currentWorkflow - 1
      }).state :
      undefined;
  }

  $scope.progressWorkflow = function() {
    if (validWorkflowEntry()) {
      saveWorkflowCommentsInHistoryLog();
      progressWorkflow();
      $scope.$broadcast('postWorkflowSave');
      $modalInstance.close(1);
    }
  };

  function progressWorkflow() {
    if (personnelData.currentWorkflow < $scope.workflowStates.length) {
      personnelData.currentWorkflow = personnelData.currentWorkflow + 1;
    }
    $scope.currentWorkflowState = findState().state;
    $rootScope.$broadcast('updatedJobDescriptionChild', [personnelData]);
    AlertService.add('success', 'Progressed to ' + $scope.currentWorkflowState);
  }

  $scope.saveWorkflow = function() {
    if (validWorkflowEntry()) {
      saveWorkflowCommentsInHistoryLog();
      $rootScope.$broadcast('updatedJobDescriptionChild');
      $scope.$broadcast('postWorkflowSave');
      $modalInstance.close(1);
    }
  };

  function saveWorkflowCommentsInHistoryLog() {
    PersonnelService.find(personnelData._id).then(function(httpResult) {
      var commLog = {
        message: $scope.currentTitle + '<br/><br/>' + $scope.personnelWorkflow.comments
      };
      // saving the commlog also saves the personnel
      CommLogService.addToPersonnel($scope, httpResult.data, commLog);
    });
  }

  $scope.revertWorkflow = function() {
    if (validWorkflowEntry()) {
      if (personnelData.currentWorkflow > 0) {
        personnelData.currentWorkflow = personnelData.currentWorkflow - 1;
      }
      $rootScope.$broadcast('updatedJobDescriptionChild');
      $modalInstance.close(1);
    }
  };

  function validWorkflowEntry() {
    if (!$scope.personnelWorkflowForm || $scope.personnelWorkflowForm.$valid) {
      return true;
    }

    return false;
  }

  $scope.notProgressing = function() {
    $scope.personnelData.acceptable = false;
    saveWorkflowCommentsInHistoryLog();
    $rootScope.$broadcast('updatedJobDescriptionChild');
    $modalInstance.close(1);
  };

  $scope.hoverInMessage = function(shortcutKey) {
    $scope.shortcutKeyMessage = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyMessage = undefined;
  };

  hotkeys.add({
    combo: 'space',
    description: 'Edit history log',
    callback: function() {
      angular.element('[name="personnelWorkflow.comments"]').focus();
    }
  });


}

/* global WorkflowProgressCtrl */

angularModules.controller('WorkflowCtrl', ['$scope', '$modal', 'WorkflowService', '_', WorkflowCtrl]);

function WorkflowCtrl($scope, $modal, WorkflowService, _) {

  $scope.workflowStates = WorkflowService.loadStates($scope);

  $scope.openCurrentWorkflowState = function(personnel) {

    var modalInstance = $modal.open({
      templateUrl : 'partials/workflow/workflow',
      controller : 'WorkflowProgressCtrl',
      size: 'lg',
      resolve : {
        personnelData : function() {
          return personnel;
        },
        workflowStates : function() {
          return $scope.workflowStates;
        },
        jobDescription : function() {
          return $scope.jobDescription;
        }
      }
    });
  };

  $scope.getCurrentWorkflow = function(personnel) {
    return _.findWhere($scope.workflowStates, {'index': personnel.currentWorkflow}).state;
  };

  $scope.progressWorkflow = function(personnel) {
    personnel.currentWorkflow = personnel.currentWorkflow + 1;
  };

}
angularModules.controller('WorkflowPersonnelCtrl', ['$scope', '$modalInstance', 'personnelData',
  WorkflowPersonnelCtrl]);

function WorkflowPersonnelCtrl($scope, $modalInstance, personnelData) {
  
  $scope.personnel = personnelData;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}
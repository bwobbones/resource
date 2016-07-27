angularModules.controller('PersonnelSummaryCtrl', ['$aside', '$modalInstance', '$scope', '$state', 'selectedPersonnel', PersonnelSummaryCtrl]);

function PersonnelSummaryCtrl($aside, $modalInstance, $scope, $state, selectedPersonnel) {
  
  $scope.selectedPersonnel = selectedPersonnel;

  $scope.clearSelected = function() {
    $modalInstance.dismiss('cancel');
    $scope.selectedPersonnel = undefined;
  }

  $scope.editSelected = function() {
    $modalInstance.dismiss('cancel');
    $state.go('personnel.editPersonnel', {
      id: selectedPersonnel._id
    });
  }

}

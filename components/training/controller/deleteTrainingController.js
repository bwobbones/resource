angularModules.controller('DeleteTrainingCtrl', DeleteTrainingCtrl);

function DeleteTrainingCtrl($scope, $modalInstance, AlertService, entity, PersonnelService, personnelData) {
  
  $scope.training = entity;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteTraining = function() {
  	$scope.training.deleted = true;
    $modalInstance.close(1);
    PersonnelService.save($scope, personnelData);
    AlertService.add("success", $scope.training.name + " deleted");
  };
  
}

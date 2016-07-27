angularModules.controller('DeleteQualificationCtrl', DeleteQualificationCtrl);

function DeleteQualificationCtrl($scope, $modalInstance, AlertService, entity, PersonnelService, personnelData) {
  
  $scope.qualification = entity;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteQualification = function() {
  	$scope.qualification.deleted = true;
    $modalInstance.close(1);
    PersonnelService.save($scope, personnelData);
    AlertService.add("success", $scope.qualification.name + " deleted");
  };
  
}

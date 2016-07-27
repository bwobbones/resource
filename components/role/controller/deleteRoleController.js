angularModules.controller('DeleteRoleCtrl', DeleteRoleCtrl);

function DeleteRoleCtrl($scope, $modalInstance, AlertService, role, PersonnelService, personnelData) {
  
  $scope.role = role;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteRole = function() {
  	$scope.role.deleted = true;
    $modalInstance.close(1);
    PersonnelService.save($scope, personnelData);
    AlertService.add("success", $scope.role.roleName + " deleted");
  };
  
}

angularModules.controller('DeleteAffiliationCtrl',  DeleteAffiliationCtrl);

function DeleteAffiliationCtrl($scope, $modalInstance, AlertService, entity, PersonnelService, personnelData) {
  
  $scope.affiliation = entity;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteAffiliation = function() {
    $scope.affiliation.deleted = true;
    $modalInstance.close(1);
     PersonnelService.save($scope, personnelData);
    AlertService.add("success", $scope.affiliation.name + " deleted");
  };
  
}

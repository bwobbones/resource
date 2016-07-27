angularModules.controller('DeletePersonnelCtrl', ['$scope', '$rootScope', '$modalInstance', '$state',
  'PersonnelService', 'personnelData', DeletePersonnelCtrl]);

function DeletePersonnelCtrl($scope, $rootScope, $modalInstance, $state, PersonnelService,
  personnelData) {
  
  $scope.personnelName = personnelData.name + " " + personnelData.surname;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.deletePersonnel = function () {
    PersonnelService.remove($rootScope.user.username, personnelData).then(function(httpResult) {
      $modalInstance.close(1);
      $state.transitionTo('personnel.addPersonnel');
    });
  };
}
// mia margaret lucas smith 20 minerva loop success wa 6164
// i love you my dad and mmum
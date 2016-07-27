angularModules.controller('DirtyPersonnelCtrl', ['$scope', '$modalInstance', '$state',
  'pForm', 'toState', 'toParams', DirtyPersonnelCtrl
]);

function DirtyPersonnelCtrl($scope, $modalInstance, $state, pForm, toState, toParams) {

  $scope.pForm = pForm;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.discardPersonnel = function() {
    $modalInstance.close('discard');
    $scope.pForm.$setPristine();
    $state.go(toState);
  };
}

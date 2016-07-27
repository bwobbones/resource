angularModules.controller('DeleteJobDescriptionCtrl', ['$scope', '$rootScope', '$modalInstance', '$state', '$http',
  'AlertService', 'jobDescriptionId', 'position', DeleteJobDescriptionCtrl
]);

function DeleteJobDescriptionCtrl($scope, $rootScope, $modalInstance, $state, $http,
  AlertService, jobDescriptionId, position) {

  $scope.position = position;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteJobDescription = function() {
    $http.delete('/api/jobDescription/' + jobDescriptionId).
    success(function(data) {
      $modalInstance.close(1);
      AlertService.add("success", position + " deleted");
      $state.go('jobDescription.addJobDescription');
    });
  };
}

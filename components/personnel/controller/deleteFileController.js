angularModules.controller('DeleteFileCtrl', ['$scope', '$modalInstance', 'fileName', DeleteFileCtrl]);

function DeleteFileCtrl($scope, $modalInstance, fileName) {
  
  $scope.fileName = fileName;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.deleteFile = function () {
    $modalInstance.close(1);
  };
}

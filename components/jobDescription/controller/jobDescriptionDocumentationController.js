angularModules.controller('JobDescriptionDocumentationCtrl', ['$scope', '$rootScope', '$http',
  'Upload', '$modal', '_', 'FileService', 'AlertService', JobDescriptionDocumentationCtrl]);

function JobDescriptionDocumentationCtrl($scope, $rootScope, $http, Upload, $modal, _, FileService, AlertService) {

  $scope.onFileSelect = function($files, documentationType) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      var fileId = new ObjectId().toString();
      $scope.form.uploadValue = {};
      $scope.form.uploadValue[fileId] = 0;

      if ($scope.form.files === undefined) {
        $scope.form.files = [];
      }
      FileService.upload($scope, file, fileId);
    }
  };

  $scope.downloadFile = function(fileId) {
    var file = FileService.findFileById($scope, fileId);
    FileService.download($scope, file);  
  };

  $scope.openDeleteFileMessageBox = function(fileId) {
    var file = FileService.findFileById($scope, fileId);
    var modalInstance = $modal.open({
      templateUrl : 'partials/jobDescription/deleteFile',
      controller : 'DeleteFileCtrl',
      resolve : {
        fileName : function() {
          return file.fileName;
        }
      }
    });

    modalInstance.result.then(function () {
      var oldFiles = $scope.form.files;
      $scope.form.files = [];
      angular.forEach(oldFiles, function(file) {
        if (file.fileId != fileId) $scope.form.files.push(file);
      });
      AlertService.add("success", file.fileName + " deleted");
    });

  }

}
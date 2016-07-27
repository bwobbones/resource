angularModules.controller('PersonnelDocumentationCtrl', ['$scope', 'Upload', '$http', '$modal', '_',
  'FileService', 'AlertService', 'PersonnelService', PersonnelDocumentationCtrl]);

function PersonnelDocumentationCtrl($scope, Upload, $http, $modal, _, FileService, AlertService, PersonnelService) {
  
  $scope.documentationTypes = [
    { type: 'cv', displayName: 'CV' }, 
    { type: 'certificates', displayName: 'Certificates' },
    { type: 'other', displayName: 'Other' }
  ];
  
  $scope.uploadComplete = true;
  
  $scope.onFileSelect = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fileId = new ObjectId().toString();
        $scope.form.uploadValue = {};
        $scope.form.uploadValue[fileId] = 0;
        if ($scope.form.files === undefined) {
          $scope.form.files = [];
        }
        FileService.upload($scope, file, fileId);
      }
    }
  };

  $scope.downloadFile = function(fileId) {
    var file = FileService.findFileById($scope, fileId);
    FileService.download($scope, file);
  };

  $scope.openDeleteFileMessageBox = function(fileId) {
    var file = FileService.findFileById($scope, fileId);
    var modalInstance = $modal.open({
      templateUrl : 'partials/personnel/deleteFile',
      controller : 'DeleteFileCtrl',
      resolve : {
        fileName : function() {
          return file.fileName;
        },
        fileId : function() {
          return fileId;
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
      PersonnelService.save($scope, $scope.form, $scope.pForm);
    });

  }

}
angularModules.controller('QualificationCtrl', ['$scope', '$modalInstance', '$filter', 'AlertService',
  'PersonnelService', 'TypeAheadService', 'personnelData', 'entity', 'pForm', QualificationCtrl]);

function QualificationCtrl($scope, $modalInstance, $filter, AlertService,
  PersonnelService, TypeAheadService, personnelData, entity, pForm) {
  
  $scope.personnelName = personnelData.name ? personnelData.name : "";
  $scope.qualifications = personnelData.qualifications;
  $scope.qualification = entity;
  
  $scope.cancel = function() {
    $modalInstance.close(1);
  };

  $scope.ok = function () {
    saveQualification();
    $modalInstance.close(1);
  };

  $scope.saveAndNew = function() {
    saveQualification();
    $scope.qualification = {};
  };

  function saveQualification() {
    $scope.qualification._id = $scope.qualification._id || new ObjectId();
    personnelData.qualifications = personnelData.qualifications || [];

    if (findQualByQualId($scope.qualification._id) !== undefined) {
      updateQualifications($scope.qualification._id);
    }

    $scope.qualification.expiryDate = $filter('date')($scope.qualification.expiryDate, 'dd/MM/yyyy');
    $scope.qualification.dateObtained = $filter('date')($scope.qualification.dateObtained, 'dd/MM/yyyy');
    personnelData.qualifications.push($scope.qualification);
    PersonnelService.save($scope, personnelData, pForm);
    AlertService.add("success", "Qualification " + $scope.qualification.name + " added");
  }

  function findQualByQualId(qualId) {
    return _.find(personnelData.qualifications, function(qualification){ return qualification._id === qualId; });
  }

  function updateQualifications(qualificationId) {
    var oldQualifications = personnelData.qualifications;
    personnelData.qualifications = [];
    _.each(oldQualifications, function(qualification) {
      if (qualification._id != qualificationId) personnelData.qualifications.push(qualification);
    });
  }

  $scope.typeAheadQualifications = function(value) {
    return TypeAheadService.query('qualification', value);
  };

}


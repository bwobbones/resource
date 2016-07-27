angularModules.controller('PreEmploymentCtrl', ['$scope', '$filter', 'PersonnelService',
  'TypeAheadService', 'hotkeys', PreEmploymentCtrl]);

function PreEmploymentCtrl($scope, $filter, PersonnelService, TypeAheadService, hotkeys) {

  $scope.dateOptions = {
    dateFormat: 'd/m/yy',
    changeMonth: true
  };

  $scope.personnelWorkflow.additionalTraining = $scope.personnelWorkflow.additionalTraining || [];

  $scope.typeAhead = function(field, value) {
    return TypeAheadService.query(field, value);
  };

  $scope.addTraining = function() {
    var newTraining = {
      _id: new ObjectId(),
      name: $scope.personnelWorkflow.newTraining
    };
  	$scope.personnelWorkflow.additionalTraining.push(newTraining);
    $scope.personnelWorkflow.newTraining = '';
  };

  $scope.deleteTraining = function(training) {
  	$scope.personnelWorkflow.additionalTraining = _.without($scope.personnelWorkflow.additionalTraining, training);
  };

  $scope.editTraining = function() {
    $scope.collapseTrainingEditable = !$scope.collapseTrainingEditable;
    if (!$scope.collapseTrainingEditable) {
      $scope.editTrainingName = 'Edit';
    } else {
      $scope.editTrainingName = 'End Edit';
    }
  };

  $scope.setDefaultCompletedDate = function(training) {
    if (!training.dateObtained) {
      training.dateObtained = _.clone(training.dateBooked);
    }
  };

  $scope.$on('postWorkflowSave', function() {
    var trainings = [];
    for (var i = 0; i < $scope.personnelWorkflow.additionalTraining.length; i++) {
      var additionalTraining = $scope.personnelWorkflow.additionalTraining[i];
      if (additionalTraining.complete) {
        trainings.push(additionalTraining);
      }
      additionalTraining.dateBooked = $filter('date')(additionalTraining.dateBooked, 'dd/MM/yyyy');
      additionalTraining.expiryDate = $filter('date')(additionalTraining.expiryDate, 'dd/MM/yyyy');
      additionalTraining.dateObtained = $filter('date')(additionalTraining.dateObtained, 'dd/MM/yyyy');
    }
    PersonnelService.saveTraining($scope, $scope.personnelData._id, trainings);
  });

  $scope.hoverInMedical = function(shortcutKey) {
    $scope.shortcutKeyMedical = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyMedical = undefined;
  };

  hotkeys.add({ combo: 'm', description: 'Medical required',
    callback: function() {
      $scope.personnelWorkflow.medical = $scope.personnelWorkflow.medical === 'Yes' ? $scope.personnelWorkflow.medical = '' : 'Yes';
    }
  });
}
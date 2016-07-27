angularModules.controller('TrainingCtrl', ['$scope', '$modalInstance', '$filter', 'AlertService',
  'PersonnelService', 'TypeAheadService', 'personnelData', 'entity', 'pForm',
  TrainingCtrl]);

function TrainingCtrl($scope, $modalInstance, $filter, AlertService, PersonnelService, TypeAheadService,
  personnelData, entity, pForm) {

  $scope.personnelName = personnelData.name ? personnelData.name : "";
  $scope.trainings = personnelData.trainings;
  $scope.training = entity;
  
  $scope.cancel = function() {
    $modalInstance.close(1);
  };

  $scope.ok = function () {
    saveTraining();
    $modalInstance.close(1);
  };

  $scope.saveAndNew = function() {
    saveTraining();
    $scope.training = {};
  };

  function saveTraining() {
    $scope.training._id = $scope.training._id || new ObjectId();
    personnelData.trainings = personnelData.trainings || [];

    if (findTrainingByTrainingId($scope.training._id) !== undefined) {
      updateTrainings($scope.training._id);
    }
    $scope.training.dateObtained = $filter('date')($scope.training.dateObtained, 'dd/MM/yyyy');
    $scope.training.expiryDate = $filter('date')($scope.training.expiryDate, 'dd/MM/yyyy');
    personnelData.trainings.push($scope.training);
    PersonnelService.save($scope, personnelData, pForm);
    AlertService.add("success", "Training " + $scope.training.name + " added");
  }

  function findTrainingByTrainingId(trainingId) {
    return _.find(personnelData.trainings, function(training){ return training._id === trainingId; });
  }

  function updateTrainings(trainingId) {
    var oldTrainings = personnelData.trainings;
    personnelData.trainings = [];
    _.each(oldTrainings, function(training) {
      if (training._id != trainingId) personnelData.trainings.push(training);
    });
  }

  $scope.typeAhead = function(field, value) {
    return TypeAheadService.query(field, value);
  };

}


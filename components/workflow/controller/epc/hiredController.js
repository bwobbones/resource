angularModules.controller('HiredCtrl', ['$scope', 'GoogleLocationService', 'PersonnelService',
  'hotkeys', HiredCtrl]);

function HiredCtrl($scope, GoogleLocationService, PersonnelService, hotkeys) {

  var role = {};

  $scope.hiredText = $scope.personnelWorkflow.hired ? 'Yes' : 'No';

  $scope.$watch('personnelWorkflow.hired', function(newValue, oldValue) {
    if (newValue) {
      $scope.personnelWorkflow.hiredStartDate = $filter('date')($scope.personnelWorkflow.hiredStartDate, 'dd/MM/yyyy');
      $scope.personnelWorkflow.hiredStartDate = $scope.personnelWorkflow.hiredStartDate || _.clone($scope.jobDescription.daterequired);
      $scope.personnelWorkflow.roleLocation = $scope.personnelWorkflow.roleLocation || _.clone($scope.jobDescription.worklocation);
      role._id = new ObjectId();
    }
  });

  $scope.toggleHired = function() {
    $scope.hiredText = $scope.hiredText === 'No' ? 'Yes' : 'No';
  };

  $scope.getAddress = function(searchText) {
    return GoogleLocationService.findAddresses(searchText).then(function (result) {
      return result;
    });
  };

  $scope.$on('postWorkflowSave', function() {
    role.roleName = $scope.jobDescription.position;
    role.startDate = $scope.personnelWorkflow.hiredStartDate;
    role.responsibilities = $scope.jobDescription.rolesResponsibilities;
    role.client = $scope.jobDescription.company;
    PersonnelService.saveRole($scope, $scope.personnelData._id, role);
  });

  $scope.hoverInHired = function(shortcutKey) {
    $scope.shortcutKeyHired = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyHired = undefined;
  };

  hotkeys.add({ combo: 'h', description: 'Candidate hired',
    callback: function() {
      $scope.personnelWorkflow.hired = !$scope.personnelWorkflow.hired;
      $scope.toggleHired();
    }
  });

}
angularModules.controller('FormatCVCtrl', ['$scope', 'UserService', FormatCVCtrl]);

function FormatCVCtrl($scope, UserService) {

  UserService.getUsers().then(function(contacts) {
    $scope.contacts = contacts;
    $scope.personnelWorkflow.cvCheckedBy = _.find(contacts, function(contact){ return contact._id === $scope.user._id; });
  });

}
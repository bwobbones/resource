angularModules.controller('SubmissionCtrl', ['$scope', 'PersonnelService', 'EmailService',
  'hotkeys', SubmissionCtrl
]);

function SubmissionCtrl($scope, PersonnelService, EmailService, hotkeys) {

  $scope.dropDownOpen = false;

  $scope.methods = [{
    name: 'Email',
    icon: 'fa-envelope',
    shortcutKey: 'e'
  }, {
    name: 'Portal',
    icon: 'fa-desktop',
    shortcutKey: 'p'
  }, {
    name: 'Hard Copy',
    icon: 'fa-folder',
    shortcutKey: 'h'
  }, {
    name: 'Other',
    icon: 'fa-question-circle',
    shortcutKey: 'o'
  }];

  PersonnelService.find($scope.personnelData._id).then(function(personnel) {
    $scope.personnelData.files = personnel.data.files;
  });

  $scope.selectMethod = function($event, method) {
    $event.preventDefault();
    $scope.personnelWorkflow.submissionMethod = method;
    $scope.dropDownOpen = !$scope.dropDownOpen;
  };

  $scope.performAction = function() {
    if ($scope.personnelWorkflow.submissionMethod === 'Email') {
      EmailService.send($scope.personnelWorkflow.submissionDetail);
    }
  };

  // Hotkeys
  $scope.hoverInMethod = function(shortcutKey) {
    $scope.shortcutKeyMethod = '(' + shortcutKey + ')';
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyMethod = undefined;
  };

  _.each($scope.methods, function(method) {
    hotkeys.add({
      combo: method.shortcutKey,
      description: 'Use the ' + method.name + ' method of submission',
      callback: function() {
        $scope.personnelWorkflow.submissionMethod = method.name;
      }
    });
  });

  hotkeys.add({
    combo: 'd',
    description: 'Select documents',
    callback: function() {
      console.log('dddd');
      angular.element('[name="personnelWorkflow.submissionDocuments"]').focus();
    }
  });

}

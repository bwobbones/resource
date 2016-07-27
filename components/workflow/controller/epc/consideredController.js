angularModules.controller('ConsideredCtrl', ['$scope', 'hotkeys', ConsideredCtrl]);

function ConsideredCtrl($scope, hotkeys) {

  $scope.$watch('personnelWorkflow.considered', function(newValue, oldValue) {
    if (newValue !== oldValue && !$scope.personnelWorkflow.comments) {
      if (newValue === 'Yes') {
        $scope.personnelWorkflow.comments = 'Considered for ' + $scope.jobDescription.position + ' with ' + $scope.jobDescription.company;
      } else {
        $scope.personnelWorkflow.comments = 'Not considered for ' + $scope.jobDescription.position + ' with ' + $scope.jobDescription.company;
      }
    }
  });

  $scope.hoverInConsidered = function(shortcutKey) {
    $scope.shortcutKeyConsidered = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyConsidered = undefined;
  };

  hotkeys.add({ combo: 'y', description: 'Candidate considered',
    callback: function() {
      $scope.personnelWorkflow.considered = 'Yes';
    }
  });

  hotkeys.add({ combo: 'n', description: 'Candidate not considered',
    callback: function() {
      $scope.personnelWorkflow.considered = 'No';
    }
  });

}
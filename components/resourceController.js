angularModules.controller('ResourceCtrl', ['$scope', '$rootScope', '$state', 'DateValidationService', ResourceCtrl]);

function ResourceCtrl($scope, $rootScope, $state, DateValidationService) {

  $scope.$state = $state;

  $scope.isLoggedIn = function() {
    return $scope.user && $scope.user.username !== undefined;
  };

  $scope.getUsername = function() {
    if (!$scope.user) {
      return '';
    }

    return $scope.user.fullname;
  };

  $scope.getStates = function() {
    return $state.current.name.split('.');
  }

  $rootScope.uploadableMimeTypes = "'application/vnd.openxmlformats-officedocument.wordprocessingml.document" +
    ",application/pdf," +
    "application/msword'";

  $scope.saveEvent = function($event) {
    $rootScope.$broadcast('saveDataEvent');
  };

  $rootScope.validateDate = function(date) {
    var valid = DateValidationService.validate(date);
    $rootScope.dateValidationMessage = !valid ? 'Date format needs to be like 1/1/2010 or Jan 2010' : undefined;
    return valid;
  };
  
  // temporary measure until MIN-400
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    if (toState.name.indexOf('jobDescription') !== -1) {
      $rootScope.isJobDescription = true;
    } else {
      $rootScope.isJobDescription = false;
    }
  });

}

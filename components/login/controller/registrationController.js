angularModules.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state('register', {
    url: '/registerNew',
    views: {
      "dataPanel": {
        templateUrl: 'partials/login/register',
        controller: 'RegistrationCtrl'
      }
    }
  })
});

angularModules.controller('RegistrationCtrl', ['$http', '$rootScope', '$scope', '$state', 'localStorageService', 'EventLogService', RegistrationCtrl]);

function RegistrationCtrl($http, $rootScope, $scope, $state, localStorageService, EventLogService) {
  
  $scope.registrationForm = {};
  
  $scope.register = function() {

    $scope.registrationForm.jobTitle = 'Administrator';
    
    $http.post('/register', $scope.registrationForm).then(function(user, status, headers, config) {
      EventLogService.log("login", $scope.loginForm.username, "login");
      localStorageService.set('authToken', user.data.token);
      $rootScope.user = user.data.user;
      $state.go('index');
    });
  };

}

angularModules.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state('login', {
    url: '/loginUser',
    views: {
      "dataPanel": {
        templateUrl: "partials/login/login"
      }
    }
  }).state('resetPassword', {
    url: '/api/resetPassword',
    views: {
      "dataPanel": {
        templateUrl: "partials/login/resetPassword",
        controller: "LoginCtrl"
      }
    }
  });
});

angularModules.controller('LoginCtrl', ['$window', '$scope', '$rootScope', '$state', '$http', 'AlertService', 
  'EventLogService', 'localStorageService', LoginCtrl]);

function LoginCtrl($window, $scope, $rootScope, $state, $http, AlertService, EventLogService, localStorageService) {
  $scope.loginForm = {};

  $scope.error = false;

  checkLoggedIn();
  
  $scope.queries = {};
  getQueriesFromLocalStorage()
  var lastQueries = $scope.$on('lastQueriesChanged', function(event) {
    getQueriesFromLocalStorage();
  });
  $scope.$on('$destroy', lastQueries);
  
  function getQueriesFromLocalStorage() {
    $scope.queries.lastPersonnelQuery = localStorageService.get('lastPersonnelQuery');
    $scope.queries.lastJobQuery = localStorageService.get('lastJobQuery');
  }

  $scope.login = function() {
    var activeElement = $window.document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }
    
    $http.post('/login', $scope.loginForm).then(function(user, status, headers, config) {
      if (!user.data.success) {
        $scope.error = true;
        $state.go('login');
      } else {
        EventLogService.log("login", $scope.loginForm.username, "login");
        localStorageService.set('authToken', user.data.token);
        $rootScope.user = user.data.user;
        $state.go('index');
      }
    });
  };

  $rootScope.logout = function() {
    $scope.loginForm = {};
    EventLogService.log("logout", $rootScope.user.username, "logout");
    $rootScope.user = undefined;
    localStorageService.remove('authToken');
    $state.go('login', null, {
      reload: true
    });
  };

  $scope.resetError = function() {
    $scope.error = false;
  };
 
  function checkLoggedIn() {
    $http.get('/api/loggedin').then(function(httpResult) {
      $rootScope.user = httpResult.data;
    }, function(err) {
      $state.go('login');
    });
  }

  $scope.saveProfile = function() {
    var newPassword = {
      username: $rootScope.user.username,
      password: $scope.confirmpassword,
      jobTitle: $scope.user.jobTitle
    };

    if ($scope.form.$valid) {
      $http.post('/api/resetPassword', newPassword).
      success(function(data, status, headers, config) {
        AlertService.add("success", "Profile Updated");
        $state.transitionTo('index');
      });
    }
  };
  
  $scope.loadPreviousQuery = function(searchType) {
    $state.go('index').then(function() {
      $scope.$broadcast('loadPreviousQuery', searchType, $scope.queries);
    });
  }

}

/* globals angularModules, IndexCtrl, DirtyPersonnelCtrl, CommLogCtrl, DeletePersonnelCtr */

angularModules.config(function($stateProvider) {

  $stateProvider.state('personnel', {
    abstract: true,
    views: {
      'dataPanel': {
        templateUrl: 'partials/personnel/abstractPersonnel',
        controller: PersonnelCtrl
      }
    }
  }).state('personnel.addPersonnel', {
    url: '/addPersonnel',
    views: {
      'dataPanel': {
        templateUrl: 'partials/personnel/addPersonnel'
      }
    }
  }).state('personnel.editPersonnel', {
    url: '/editPersonnel/:id',
    views: {
      'dataPanel': {
        templateUrl: 'partials/personnel/editPersonnel'
      }
    },
    resolve: {
      loggedin: checkLoggedin
    }
  });
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

  // Initialize a new promise
  var deferred = $q.defer();

  // Make an AJAX call to check if the user is logged in
  $http.get('/loggedin').success(function(user) {

    // Authenticated
    if (user !== '0') {
      $timeout(deferred.resolve, 0);
    }

    // Not Authenticated
    else {
      $rootScope.message = 'You need to log in.';
      $timeout(function() {
        deferred.reject();
      }, 0);
      $location.url('/loginUser');
    }
  });

};

angularModules.controller('PersonnelCtrl', ['$scope', '$rootScope', '$modal', '$state', 'hotkeys', 'localStorageService',
  'AlertService', 'GoogleLocationService', 'DocxService', 'PersonnelService', 'EmailService', 'TabService',
  'TypeAheadService', PersonnelCtrl
]);

function PersonnelCtrl($scope, $rootScope, $modal, $state, hotkeys, localStorageService, AlertService,
  GoogleLocationService, DocxService, PersonnelService, EmailService, TabService, TypeAheadService) {

  $scope.tabPanes = TabService.getTabs('personnelTabs');
  TabService.openRemembered('personnelTabs');
  TabService.registerTabWatcher($scope, 'personnelTabs');

  $scope.form = {};

  var unbindDirtyCheck = $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if ($scope.pForm.$dirty) {
      event.preventDefault();
      var modalInstance = $modal.open({
        templateUrl: 'partials/personnel/dirtyPersonnel',
        controller: 'DirtyPersonnelCtrl',
        resolve: {
          pForm: function() {
            return $scope.pForm;
          },
          toState: function() {
            return toState.name;
          },
          toParams: function() {
            return toParams;
          }
        }
      });
    }
  });
  $scope.$on('$destroy', unbindDirtyCheck);

  var unbindStateChange = $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
    if (toState.name === 'index' || toState.name === 'personnel.addPersonnel') {
      $scope.originalPersonnel = {};
    }

    if (toParams.id !== undefined) {
      PersonnelService.find(toParams.id).then(function(httpResult) {
        $scope.originalPersonnel = angular.copy(httpResult.data);
        $scope.form = httpResult.data;
      });
    } else {
      if ($scope.form !== undefined) {
        $scope.reset();
      } else {
        $scope.form = {};
        $scope.form.files = [];
      }
    }
  });
  $scope.$on('$destroy', unbindStateChange);

  // this ensures that if the user adds a child entity (role/qual etc) move to an edit state.
  var transitionToEdit = $scope.$on('personnelChangedEvent', function(event, personnelId) {
    if (!$scope.form._id) {
      $state.go('personnel.editPersonnel', {
        id: personnelId
      });
    }
  });
  $scope.$on('$destroy', transitionToEdit);

  $scope.reset = function() {
    $scope.form._id = undefined;
    $scope.form.name = undefined;
    $scope.form.surname = undefined;
    $scope.form.currentlyemployed = undefined;
    $scope.form.rightToWork = true;
    $scope.form.availabledate = undefined;
    $scope.form.noticeperiod = undefined;
    $scope.form.preferredname = undefined;
    $scope.form.referrer = undefined;
    $scope.form.project = undefined;
    $scope.form.dateofbirth = undefined;
    $scope.form.hchomephone = undefined;
    $scope.form.hcmobile = undefined;
    $scope.form.hcemail = undefined;
    $scope.form.hcaddress = undefined;
    $scope.form.hshomephone = undefined;
    $scope.form.hsmobile = undefined;
    $scope.form.hsaddress = undefined;
    $scope.form.hchomephone = undefined;
    $scope.form.nationality = undefined;
    $scope.form.citizenship = undefined;
    $scope.form.passportnumber = undefined;
    $scope.form.passportexpiry = undefined;
    $scope.form.nearestairport = undefined;
    $scope.form.holdsvisa = undefined;
    $scope.form.visatype = undefined;
    $scope.form.visaholder = undefined;
    $scope.form.visastartdate = undefined;
    $scope.form.visaenddate = undefined;
    $scope.form.roles = undefined;
    $scope.form.qualifications = undefined;
    $scope.form.affiliations = undefined;
    $scope.form.trainings = undefined;
    $scope.form.emergency1 = undefined;
    $scope.form.emergency2 = undefined;
    $scope.form.comments = undefined;
    $scope.form.commLog = undefined;
    $scope.form.notes = undefined;

    $scope.form.files = [];
  };

  $scope.savePersonnel = function() {
    PersonnelService.save($scope, $scope.form, $scope.pForm).then(function(httpResult) {
      $scope.originalPersonnel = angular.copy(httpResult.data);
      $state.transitionTo('personnel.editPersonnel', {
        id: httpResult.data._id
      });
    });
  };

  $scope.addNote = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/commLog/note',
      controller: 'NoteCtrl',
      size: 'lg',
      resolve: {
        personnelData: function() {
          return $scope.form;
        },
        pForm: function() {
          return $scope.pForm;
        }
      }
    });
  };

  $scope.openDeleteMessageBox = function() {

    var modalInstance = $modal.open({
      templateUrl: 'partials/personnel/deletePersonnel',
      controller: 'DeletePersonnelCtrl',
      resolve: {
        personnelData: function() {
          return $scope.form;
        }
      }
    });
  };

  $scope.getAddress = function(searchText) {
    return GoogleLocationService.findAddresses(searchText).then(function(result) {
      return result;
    });
  };

  $scope.sendMail = function() {
    EmailService.send($scope.form.hcemail);
  };

  $scope.generateCV = function() {
    DocxService.generateCV($scope.form);
  };

  $scope.hoverIn = function(shortcutKey) {
    $scope.shortcutKey = shortcutKey;
  };

  $scope.hoverOut = function() {
    $scope.shortcutKey = undefined;
  };

  hotkeys.add({
    combo: 'g',
    description: 'Generate CV',
    callback: function() {
      $scope.generateCV();
    }
  });

}

/* globals PersonnelCtrl */

describe('personnel', function() {
  
  var personnelCtrl;
  var rootScope;
  var scope;
  var _;
  var state;
  var httpBackend;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope, $state, $httpBackend, $q, HtmlifyDataService, PersonnelService, TypeAheadService) {

    // define the injected variables;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    state = $state;
    httpBackend = $httpBackend;

    // ever-required variables
    scope.form = {};
    scope.pForm = {};
    scope.pForm.$valid = true;
    scope.pForm.$setPristine = function() {};
    rootScope.user = {};
    rootScope.user.username = 'greg';

    spyOn(PersonnelService, 'save').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({
        data: {
          _id: 1
        }
      });
      return deferred.promise;
    });

    spyOn(TypeAheadService, 'query').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve([{}]);
      return deferred.promise;
    });

    // dependencies
    _ = window._;

    // ui-router default calls
    httpBackend.expectGET('partials/index/index').respond(200);

    personnelCtrl = $controller(PersonnelCtrl, {
      $scope: scope, 
      $state: state,
      _: _, 
      PersonnelListService: mockPersonnelListService,
      AlertService: mockAlertService,
      EventLogService: mockEventLogService,
      GoogleLocationService: mockGoogleLocationService,
      HtmlifyDataService: HtmlifyDataService
    });
    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('PersonnelCtrl', function() {
    
    it('should submit a personnel', function() {
      // given a personnel
      var newPersonnel = {'_id': 1,'name': 'Gregie', 'commLog': []};

      // when I call submit personnel 
      httpBackend.flush();
      scope.savePersonnel();

      // then ill transition to the edit state
      httpBackend.expectGET('partials/personnel/abstractPersonnel').respond(200);
      httpBackend.expectGET('/loggedin').respond(200);
      httpBackend.expectGET('partials/personnel/editPersonnel').respond(200);
      httpBackend.expectGET('/api/personnel/1').respond(200);
      httpBackend.flush();
    });
  });

  it('should load a selected personnel', function() {
    var event = {};
    var toParams = { id: 1 };
    httpBackend.flush();

    var loadedPersonnel = {_id: '1', name: 'Greg', surname: 'Lucas', 'commLog': []};
    httpBackend.expectGET('/api/personnel/1').respond(loadedPersonnel);

    rootScope.$broadcast('$stateChangeSuccess', event, toParams);
    httpBackend.flush();

    expect(scope.form.surname).toBe('Lucas');
  });

  it('should retain formatting when a personnel is loaded', function() {
    var event = {};
    var toParams = { id: 1 };
    httpBackend.flush();

    var loadedPersonnel = {_id: '1', name: 'Greg', surname: 'Lucas', 'commLog': [{_id: '2', message: 'a\nb\nc'}]};
    httpBackend.expectGET('/api/personnel/1').respond(loadedPersonnel);

    rootScope.$broadcast('$stateChangeSuccess', event, toParams);
    httpBackend.flush();

    expect(scope.form.commLog[0].message).toBe('a<br/>b<br/>c');
  });

});

// mock services
var mockPersonnelListService = {
  updateList: function(scope) {
    // empty
  }
};

var mockAlertService = {
  add: function(type, msg) {
    // empty
  }
};

var mockEventLogService = {
  log: function(type, username, message, changedData) {
    // empty
  }
};

var mockGoogleLocationService = {
  query: function(searchText, useRegion) {
    // empty
  }
};
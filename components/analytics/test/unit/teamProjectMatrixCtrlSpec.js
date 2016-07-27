/* globals JobDescriptionCtrl */

describe("Resource", function() {
  
  var teamProjectMatrixCtrl;
  var rootScope;
  var scope;
  var state;
  var _;
  var httpBackend;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope, $state, $httpBackend, $q, PersonnelService) {

    // define the injected variables;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    // ever-required variables
    scope.form = {};
    rootScope.user = {};
    rootScope.user.username = 'greg';

    state = $state;

    httpBackend.expectGET('partials/index/personnelList').respond(200);
    httpBackend.expectGET('partials/index/index').respond(200);
    httpBackend.flush();

    teamProjectMatrixCtrl = $controller(TeamProjectMatrixCtrl, {
      $scope: scope, 
      $state: state,
      PersonnelService: PersonnelService
    });

    rootScope.$apply();

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  xdescribe('TeamProjectMatrixCtrl', function() {



  });

});
/* globals JobDescriptionCtrl */

describe("jobDescription", function() {
  
  var jobDescriptionCtrl;
  var rootScope;
  var scope;
  var state;
  var _;
  var httpBackend;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope, $state, $httpBackend) {

    // define the injected variables;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    // ever-required variables
    scope.form = {};
    rootScope.user = {};
    rootScope.user.username = 'greg';

    state = $state;

    // dependencies
    _ = window._;

    jobDescriptionCtrl = $controller(JobDescriptionCtrl, {
      $scope: scope, 
      $state: state,
      _: _
    });

    httpBackend.expectGET('/api/jobDescriptions').respond({jobDescriptions: []});

    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('JobDescriptionCtrl', function() {

  });

});
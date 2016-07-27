'use strict';

describe('ManageWorkflow', function() {
  
  var scope;
  var rootScope;
  var httpBackend;
  var modal;
  var manageWorkflowService;
  var templateCache;
  var q;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $q, ManageWorkflowService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    templateCache = $templateCache;
    manageWorkflowService = ManageWorkflowService;
    q = $q;

    scope.form = {};

    $templateCache.put('partials/manageWorkflow/manageWorkflow', '');
    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('ManageWorkflowService', function() {

    it('should load the workflow personnel', function() {

      var deferred = q.defer();

      httpBackend.expectGET('/api/manageWorkflow/1').respond({
        jobDescription: { _id: 1 },
        personnelData: []
      });
      var promise = manageWorkflowService.load(1);
      httpBackend.flush();
      promise.then(function(value) {
        scope.jobDescription = value.data.jobDescription;
        scope.personnelData = value.data.personnelData;
      });

      deferred.resolve([{_id: 1}]);
      rootScope.$apply();

      expect(scope.jobDescription._id).toEqual(1);
    });

  });

});
'use strict';

describe('Personnel', function() {
  
  var scope;
  var rootScope;
  var httpBackend;
  var personnelService;
  var q;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $q, PersonnelService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    personnelService = PersonnelService;
    q = $q;

    rootScope.user = {
      username: 'greg'
    };

    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('PersonnelService', function() {

  });

});
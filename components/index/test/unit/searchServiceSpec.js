'use strict';

describe('index', function() {
  
  var scope;
  var httpBackend;
  var searchService;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, SearchService) {

    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    searchService = SearchService;

    scope.form = {};
    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('SearchService', function() {

    it('should return personnel from a job description search', function() {
      var matchingPersonnel = {personnels: [
        {'_id': 0,'name': 'Gregie', surname: 'Baleste', roles: [{roleName: 'Hello'}]},
        {'_id': 1,'name': 'Jackie'}
      ]};

      httpBackend.expectPOST('/api/searchPersonnel').respond(matchingPersonnel);
      searchService.personnelSearch([{
        searchType: 'personnel',
        searchKey: 'surname',
        searchTerm: 'baleste'
      }]).then(function(personnels) {
        expect(personnels.length).toBe(2);
        expect(personnels[0].name).toBe('Gregie');
        expect(personnels[0].surname).toBe('Baleste');
        expect(personnels[0].roles.length).toBe(1);
      });
      httpBackend.flush();

    });
  });

});
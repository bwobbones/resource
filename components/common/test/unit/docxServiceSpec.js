'use strict';

describe('DocxService', function() {

  var docxService;
  var docxSpy;
  var googleLocationSpy;
  var rootScope;
  var scope;

  beforeEach(module('resource'));
  beforeEach(inject(function(DocxService, GoogleLocationService, $q, $rootScope) {
    docxService = DocxService;
    googleLocationSpy = GoogleLocationService;
    scope = $rootScope.$new();
    rootScope = $rootScope;

    docxSpy = spyOn(docxService, 'generateDocument').and.callFake(function() {
      return {};
    });

    googleLocationSpy = spyOn(googleLocationSpy, 'findStateAndCountry').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('WA, Australia');
      return deferred.promise;
    });

  }));

  afterEach(function() {
  });

  it('should call the generation service', function() {
    docxService.generateCV({homeLocation: {lat:1, lng:1}});
    scope.$apply();
    expect(docxSpy).toHaveBeenCalled();
  });

  it('should show an empty endDate as Current', function() {

    var personnel = {
      roles: [{
        roleName: 'A',
        startDate: '01/01/2012'
      }],
      homeLocation: {lat:1, lng:1}
    };

    personnel.roles.push();

    docxService.generateCV(personnel).then(function(personnelData) {
      expect(personnelData.recentExperience[0].endDate).toBe('Current');
    });
    scope.$apply();

  })

});
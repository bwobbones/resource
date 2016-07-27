'use strict';

describe('Personnel', function() {
  
  var scope;
  var rootScope;
  var httpBackend;
  var followupService;
  var personnelService;
  var q;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $q, FollowupService, PersonnelService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    followupService = FollowupService;
    personnelService = PersonnelService;
    q = $q;

    rootScope.user = {
      username: 'greg'
    };

    scope.pForm = {};
    scope.pForm.$valid = true;

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('FollowupService', function() {

    it('should update a followup', function() {

      var newFollowup = {
        _id: 2,
        message: 'New followup'
      };

      var oldMessage = {
        _id: 1,
        name: 'Greg',
        surname: 'Lucas-Smith',
        commLog: [{
          _id: 3,
          followup: [{ _id: 2, message: 'Old message'}]
        }]
      };

      var newMessage = {
        _id: 1,
        name: 'Greg',
        surname: 'Lucas-Smith',
        commLog: [{
          _id: 3,
          followup: [{ _id: 2, message: 'New followup'}]
        }]
      };

      spyOn(personnelService, "find").and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve({
          data: oldMessage
        });
        return deferred.promise;
      });

      httpBackend.expectPOST('/api/personnel/1', newMessage).respond(newMessage);
      httpBackend.expectPOST('/api/logEvent').respond(200);

      followupService.updateFollowup(1, 2, newFollowup);
      scope.$apply();
      httpBackend.flush();

    });

    it('should update a followup with a composite id', function() {

      var newFollowup = {
        _id: {"timestamp":1421475831,"machine":344897,"pid":21629,"increment":2},
        message: 'New followup'
      };

      var oldMessage = {
        _id: 1,
        name: 'Greg',
        surname: 'Lucas-Smith',
        commLog: [{
          _id: 3,
          followup: [{ _id: {"timestamp":1421475831,"machine":344897,"pid":21629,"increment":2}, message: 'Old message'}]
        }]
      };

      var newMessage = {
        _id: 1,
        name: 'Greg',
        surname: 'Lucas-Smith',
        commLog: [{
          _id: 3,
          followup: [{ _id: {"timestamp":1421475831,"machine":344897,"pid":21629,"increment":2}, message: 'New followup'}]
        }]
      };

      spyOn(personnelService, "find").and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve({
          data: oldMessage
        });
        return deferred.promise;
      });

      httpBackend.expectPOST('/api/personnel/1', newMessage).respond(newMessage);
      httpBackend.expectPOST('/api/logEvent').respond(200);

      followupService.updateFollowup(1, {"timestamp":1421475831,"machine":344897,"pid":21629,"increment":2}, newFollowup);
      scope.$apply();
      httpBackend.flush();

    });

  });

});
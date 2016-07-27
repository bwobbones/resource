'use strict';

describe('Role', function() {
  
  var scope;
  var rootScope;
  var httpBackend;
  var roleService;
  var q;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $q, RoleService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    roleService = RoleService;
    q = $q;

    rootScope.user = {
      username: 'greg'
    };

    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('RoleService', function() {

    it('should sort roles by end date reversed', function() {

      var personnel = {
        roles: []
      };

      personnel.roles.push({
        roleName: 'A',
        startDate: '01/01/2015',
        endDate: '01/01/2016'
      });

      personnel.roles.push({
        roleName: 'B',
        startDate: '01/01/2012',
        endDate: '01/01/2015'
      });

      var roles = roleService.sortedRoles(personnel);
      var sortedRoles = _.pluck(roles, 'roleName');

      expect(sortedRoles).toHaveSameItems(['A', 'B']);

    });

    it('should put no end dates at the front of the list', function() {
      var personnel = {
        roles: []
      };

      personnel.roles.push({
        roleName: 'A',
        startDate: '01/01/2015',
        endDate: '01/01/2016'
      });

      personnel.roles.push({
        roleName: 'B',
        startDate: '01/01/2012'
      });

      var roles = roleService.sortedRoles(personnel);
      var sortedRoles = _.pluck(roles, 'roleName');

      expect(sortedRoles).toHaveSameItems(['B', 'A']);
    });

  });

  it('should put no start and no end date at the back of the list', function() {
    var personnel = {
      roles: []
    };

    personnel.roles.push({
      roleName: 'B'
    });

    personnel.roles.push({
      roleName: 'A',
      startDate: '01/01/2012',
      endDate: '01/01/2016'
    });

    var roles = roleService.sortedRoles(personnel);
    var sortedRoles = _.pluck(roles, 'roleName');

    expect(sortedRoles).toHaveSameItems(['A', 'B']);
  });

  it('should make the latest role name empty when there are no roles', function() {
    var personnel = {};

    expect(roleService.latestRoleName(personnel)).toBe('');
  });

});
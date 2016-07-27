/* globals ManageWorkflowCtrl, ManageWorkflowService */
'use strict';

describe('role', function() {
  
  var rootScope, scope, modalInstance, personnelData, roleData, pForm, roleController;

  beforeEach(function() {

    module('resource');
    inject(function($controller, $rootScope) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      modalInstance = {};
      personnelData = {};
      roleData = {};
      pForm = {};

      _ = window._;

      roleController = $controller(RoleCtrl, {
        $rootScope: rootScope,
        $scope: scope,
        $modalInstance: modalInstance,
        personnelData: personnelData,
        roleData: roleData,
        pForm: pForm,
        _: _
      });

    });
  });

  afterEach(function() {
  });

  describe('RoleCtrl', function() {

    it('ensures that the year text is calculated correctly', function() {

      var roles = [];
      roles.push([{ startDate: '01/01/2010', endDate: '01/01/2014' }, '4 years']);
      roles.push([{ endDate: '01/01/2014' }, 'until 1/1/2014']);
      roles.push([{ startDate: '01/01/2010' }, '1/1/2010 to current']);
      roles.push([{ startDate: '31/12/2009', endDate: '01/01/2014' }, '4 years']);
      roles.push([{ startDate: '01/01/2014', endDate: '01/02/2014' }, 'a month']);
      roles.push([{ startDate: '01/01/2014', endDate: '02/01/2014' }, 'a day']);
      roles.push([{ startDate: 'Jan 2000', endDate: 'Mar 2000'}, '2 months']);
      roles.push([{ startDate: 'Jan 2002', endDate: 'Mar 2004'}, '2 years']);

      _.each(roles, function(role) {
        var years = scope.calculateYearsPerformed(role[0]);
        expect(years).toBe(role[1]);
      });

    });

  });

});
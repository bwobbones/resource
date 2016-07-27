/* globals ManageWorkflowCtrl, ManageWorkflowService */
'use strict';

describe('manageWorkflow', function() {
  
  var rootScope, scope, state, injector, httpBackend, modal, q, manageWorkflowController;
  var fakePerson, fakePersonEmpty;

  beforeEach(function() {

    module('resource');
    inject(function($controller, $rootScope, $state, $injector, $templateCache, $q, $httpBackend, $modal,
                    ManageWorkflowService, PersonnelService, RoleService) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      state = $state;
      injector = $injector;
      httpBackend = $httpBackend;
      modal = $modal;
      q = $q;

      $templateCache.put('partials/manageWorkflow/manageWorkflow', '');

      fakePerson = {
        name: 'Greg',
        followup: [
          { dateDue: '01/01/2013 12:00', message: 'message 1'},
          { dateDue: '01/01/2020 12:00', message: 'message 2' }
        ]
      };

      fakePersonEmpty = {
        name: 'Lexi'
      };

      spyOn(ManageWorkflowService, 'load').and.callFake(function() {

        var deferred = $q.defer();
        deferred.resolve({
          data: {
            jobDescription: {
              _id: 1,
              personnels: [ { _id: 1 }, { _id: 2 } ]
            },
            personnelData: [
              fakePerson,
              fakePersonEmpty ]
          }
        });
        return deferred.promise;
      });

      spyOn(RoleService, 'latestRole').and.callFake(function() {
        return 'latestRole';
      });

      spyOn(modal, 'open').and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve({
          data: {
            _id: 1
          }
        });
        return deferred.promise;
      });

      // ui-router default calls
      httpBackend.expectGET('partials/index/index').respond(200);
      httpBackend.flush();

      manageWorkflowController = $controller(ManageWorkflowCtrl, {
        $rootScope: rootScope,
        $scope: scope, 
        _: _, 
        ManageWorkflowService: ManageWorkflowService,
        PersonnelService: PersonnelService
      });
      
      httpBackend.expectGET('/api/personnels').respond([]);
      httpBackend.flush();

    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('ManageWorkflowCtrl', function() {

    it('should route to the manageWorkflow state when requested', function() {
      expect(state.href('manageWorkflow', { id: 1 })).toEqual('/manageWorkflow/1');
    });

    it('should load the job description when the controller is started', function() {

      rootScope.$broadcast('$stateChangeSuccess', event, {id:1});
      scope.$digest();

      expect(scope.jobDescription._id).toBe(1);

    });

    it('should load the jobDescription and merge the personnel properties', function() {

      rootScope.$broadcast('$stateChangeSuccess', event, {id:1});
      scope.$digest();

      expect(scope.mergedPersonnels.length).toBe(2);
      expect(scope.mergedPersonnels[0].name).toBe('Greg');
      expect(scope.mergedPersonnels[1].name).toBe('Lexi');

    });

    it('should show the personnel modal', function() {
      scope.viewPersonnelModal({});
      expect(modal.open).toHaveBeenCalled();
    });

    it('should set the overdue flag for overdue followups', function() {
      expect(scope.hasOverdueFollowups(fakePerson)).toBeTruthy();
      expect(scope.hasOverdueFollowups(fakePersonEmpty)).toBeFalsy();
    });

  });

});
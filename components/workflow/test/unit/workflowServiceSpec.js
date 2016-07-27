'use strict';

describe('Workflow', function() {
  
  var scope;
  var rootScope;
  var workflowService;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, WorkflowService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    workflowService = WorkflowService;
    
  }));

  describe('WorkflowService', function() {

    it('should get the workflow states', function() {

      var expectedResult = {   
        index: 0,
        state: 'Considered',
        title: 'Considered for {{ jobDescription.position }} with {{ jobDescription.company }}',
        template: 'partials/workflow/considered.jade'
      };

      scope.workflowStates = workflowService.loadStates(scope);

      expect(scope.workflowStates.length).toBe(9);
      expect(scope.workflowStates[0].state).toEqual('Considered');

    });

  });

});
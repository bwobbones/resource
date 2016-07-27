/* global input, login, createPersonnel, deleteJobDescription, deletePersonnel, logout, _ */
'use strict';

function searchElectrical() {
  element('a[href$="addJobDescription"]').click();
  input('form.company').enter('electrical');
  input('form.position').enter('electrical');
  input('form.similarPosition').enter('electrical');
}

describe('Resource', function() {
  
  describe('Workflow', function() {

    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });

    afterEach(function() {
      deleteJobDescription('electrical');
      deletePersonnel('testname');
      logout();
    });

    it('should traverse the workflow showing buttons appropriately', function() {

      var states = ['Considered', 'Available', 'Format CV', 'Submission', 'Interview Request', 
        'Quality Check', 'Interview', 'Pre-Employment Requirement', 'Hired'];

      var checkState = function(state, button) {
        if (state !== states[0]) {
          element('#workflowProgress').click();
          expect(element(button).text()).toContain(state);
          element(button).click();
          if (state === states[states.length-1]) {
            element('#workflowProgress').click();
            expect(element(button + ':hidden').text()).toMatch('[Back|Progress] to ');
            element('#saveButton').click();
          }
        }          
      };

      searchElectrical();

      // confirm that there are some available results
      expect(element('.progressbar').count()).toBeGreaterThan(0);

      _.each(states, function(state) {
        checkState(state, '#nextButton');
      });

      _.each(states.reverse(), function(state) {
        checkState(state, '#previousButton');
      });

    }); 

    it('should write workflow messages to the personnel history log', function() {

      // search
      searchElectrical();

      element('#workflowProgress').click();
      var random = Math.random();
      input('personnelWorkflow.comments').enter('this is a workflow comment: ' + random);
      element('#nextButton').click();

      element('#personnelName').click();
      expect(element('.commLogMessages').text()).toContain('this is a workflow comment: ' + random);

      element('a[href$="addJobDescription"]').click();

    });

    it('should save comments when workflow is progressed', function() {

      // search
      searchElectrical();

      element('#workflowProgress').click();
      var random = Math.random();
      input('personnelWorkflow.comments').enter('this is a workflow comment: ' + random);
      element('#nextButton').click();

      element('#workflowProgress').click();
      element('#previousButton').click();

      element('#workflowProgress').click();
      expect(input('personnelWorkflow.comments').val()).toContain('this is a workflow comment: ' + random);

    });

  });

});

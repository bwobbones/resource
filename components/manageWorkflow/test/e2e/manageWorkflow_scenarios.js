/* globals browser, login, logout, input, createJobDescription, deleteJobDescription */

describe('Resource', function() {

  describe('Manage Workflow', function() {

  	beforeEach(function() {
      browser().navigateTo('/');
      login();
      createJobDescription('testcompany', 'testposition');
    });
    
    afterEach(function() {
      deleteJobDescription('testposition');
      logout();
    });
    
    it('should navigate to the workflow management page and back', function() {

      // add new
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('remove mostly');
      input('form.position').enter('remove mostly');
      element('#addJobDescriptionButton').click();

      // search
      input('form.similarPosition').enter('ele');

      element('#manageWorkflowButton').click();
      element('#returnToJobDescriptionButton').click();

    });

  	it('should navigate to the manage workflow page and back', function() {

      input('form.similarPosition').enter('electrical');
      element('#editJobDescriptionButton').click();

  		element('#manageWorkflowButton').click();
  		expect(element('#returnToJobDescriptionButton').text()).toContain('Return to Job Description');
  		element('#returnToJobDescriptionButton').click();
  		expect(element('#manageWorkflowButton').text()).toContain('Manage Workflow');
  	});

  	it('should show the personnel results', function() {

      input('form.similarPosition').enter('electrical');
      element('#editJobDescriptionButton').click();

      element('#manageWorkflowButton').click();

      expect(element('.personnelRow').count()).toBeGreaterThan(1);

      element('#returnToJobDescriptionButton').click();

  	});

    it('should show the personnel in a dialog', function() {

      input('form.similarPosition').enter('electrical');
      element('#editJobDescriptionButton').click();
      element('#manageWorkflowButton').click();
      element('#personnelName:first').click();

      expect(element('#personnelModalHeader').text()).not().toBe('');

      element('.okPersonnelModal').click();
      element('#returnToJobDescriptionButton').click();

    });

    describe('workflow progression', function( ) {

      function navigateToManageWorkflow() {
        element('a[href$="addJobDescription"]').click();
        element("*:contains('testposition')").click();
        input('form.similarPosition').enter('electrical');
        element('#editJobDescriptionButton').click();
        element('#manageWorkflowButton').click();
        expect(element('.personnelRow').text()).toContain('checkworkflow');
      }

      beforeEach(function() {
        createPersonnel('checkworkflow', 'checkworkflow');
        addRole('electrical');

      });

      afterEach(function() {
        deletePersonnel('checkworkflow');
        element('a[href$="addJobDescription"]').click();
      });

      it('should save a workflow status when updated', function() {

        navigateToManageWorkflow();

        element('#workflowProgress-checkworkflow').click();
        var random = Math.random();
        input('personnelWorkflow.comments').enter('this is a workflow comment: ' + random);
        element('#nextButton').click();

        // should save on return
        element('#returnToJobDescriptionButton').click();

        element('#manageWorkflowButton').click();

        element('#workflowProgress-checkworkflow').click();
        element('#previousButton').click();
        element('#workflowProgress-checkworkflow').click();

        expect(input('personnelWorkflow.comments').val()).toContain('this is a workflow comment: ' + random);
        element('#nextButton').click();

        element('#returnToJobDescriptionButton').click();

      });

    })

    describe('history logs', function() {

      function navigateToManageWorkflow() {
        element('a[href$="addJobDescription"]').click();
        element("*:contains('testposition')").click();
        input('form.similarPosition').enter('electrical');
        element('#editJobDescriptionButton').click();
        element('#manageWorkflowButton').click();
        expect(element('.personnelRow').text()).toContain('checkhistory');
      }

      beforeEach(function() {
        createPersonnel('checkhistory', 'checkhistory');
        addRole('electrical');

      });

      afterEach(function() {
        deletePersonnel('checkhistory');
        element('a[href$="addJobDescription"]').click();
      });

      it('should show the last 5 history logs when there are exactly 5', function() {

        for (var i = 0; i < 5; i++) {
          addCommLog('checkhistory', 'message number: ' + i);
        }
        navigateToManageWorkflow();
        var getCount = repeater("[id='commLog-checkhistory']").count();
        expect(getCount).toEqual(5);

      });

      it('should show the last 5 history logs when there are more than 5', function() {

        for (var i = 0; i < 6; i++) {
          addCommLog('checkhistory', 'message number: ' + i);
        }
        navigateToManageWorkflow();
        var getCount = repeater("[id='commLog-checkhistory']").count();
        expect(getCount).toEqual(5);

      });

      it('should show only 3 history logs when there are only 3', function() {

        for (var i = 0; i < 3; i++) {
          addCommLog('checkhistory', 'message number: ' + i);
        }
        navigateToManageWorkflow();
        element('#commLogButton-checkhistory').click();
        var getCount = repeater("[id='commLog-checkhistory']").count();
        expect(getCount).toEqual(3);

      });

      it('should update history logs immediately on workflow progression', function() {

        navigateToManageWorkflow();

        element('#workflowProgress-checkhistory').click();
        var random = Math.random();
        input('personnelWorkflow.comments').enter('this is a workflow comment: ' + random);
        element('#nextButton').click();

        expect(element("[id='commLog-checkhistory']").text()).toContain(random);

      });

    });

    describe('followups', function() {

      function navigateToManageWorkflow() {
        element('a[href$="addJobDescription"]').click();
        element("*:contains('testposition')").click();
        input('form.similarPosition').enter('electrical');
        element('#editJobDescriptionButton').click();
        element('#manageWorkflowButton').click();
        expect(element('.personnelRow').text()).toContain('checkfollowup');
      }

      beforeEach(function () {
        createPersonnel('checkfollowup', 'checkfollowup');
        addRole('electrical');

      });

      afterEach(function () {
        deletePersonnel('checkfollowup');
        element('a[href$="addJobDescription"]').click();
      });

      function addFollowup(index, dueDate) {
        element("#addFollowupButton").click();
        input('followup.message').enter('a followup message: ' + index);
        if (dueDate) {
          input('followup.dateDue').enter(dueDate);
        }
        element('.okFollowup:visible').click();
      }

      it('should show all followups', function () {

        for (var i = 0; i < 5; i++) {
          addCommLog('checkfollowup', 'message number: ' + i);
          addFollowup(i);
        }
        navigateToManageWorkflow();

        var getCount = repeater("[id='followup-checkfollowup']").count();
        expect(getCount).toEqual(5);

      });

      it('should show overdue followups in red', function () {

        for (var i = 0; i < 1; i++) {
          addCommLog('checkfollowup', 'message number: ' + i);
          addFollowup(i, '01/01/2013 12:00');
        }
        navigateToManageWorkflow();

        element('#followupButton-checkfollowup').click();
        expect(element("#followup-checkfollowup.text-danger").text()).toContain('01/01/2013 12:00');


      });

      it('should allow acknowledgement of followups', function () {

        for (var i = 0; i < 1; i++) {
          addCommLog('checkfollowup', 'message number: ' + i);
          addFollowup(i, '01/01/2013 12:00');
        }
        navigateToManageWorkflow();

        element('#followupButton-checkfollowup').click();
        element("#complete-checkfollowup").click();

        expect(element("#followupClosed-checkfollowup.strike:visible").text()).toContain('01/01/2013 12:00');


      });

    });

    describe('deselection', function() {

      function navigateToManageWorkflow() {
        element('a[href$="addJobDescription"]').click();
        element("*:contains('testposition')").click();
        input('form.similarPosition').enter('electrical');
        element('#editJobDescriptionButton').click();
        element('#manageWorkflowButton').click();
        expect(element('.personnelRow').text()).toContain('checkdeselect');
      }

      beforeEach(function () {
        createPersonnel('checkdeselect', 'checkdeselect');
        addRole('electrical');

      });

      afterEach(function () {
        deletePersonnel('checkdeselect');
        element('a[href$="addJobDescription"]').click();
      });

      it('should allow persistent deselection of personnel', function() {

        navigateToManageWorkflow();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(0);

        element('#acceptable-checkdeselect').click();
        element('.okCommLogDone:visible').click();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(1);

        element('#returnToJobDescriptionButton').click();
        element('#manageWorkflowButton').click();

        expect(repeater('input:checkbox:not(:checked)').count()).toBe(1);

      });

      it('should ask for a reason when the user is deselected', function() {

        var random = Math.random();

        navigateToManageWorkflow();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(0);

        // deselect one
        element('#acceptable-checkdeselect').click();

        // ensure that the history log window is opened
        expect(element('.okCommLogDone:visible').count()).toEqual(1);

        // enter the commlog
        element('[name="commLog.typeEmail"]').click();
        element('[name="commLog.directionIngoing"]').click();
        input('commLog.message').enter('a basic message: ' + random);
        element('.okCommLogDone:visible').click();

        // go to the personnel page and make sure it's there
        element('a[href$="addPersonnel"]').click();
        element("*:contains('checkdeselect')").click();

        expect(element('.commLogMessages').text()).toContain('a basic message: ' + random);

        navigateToManageWorkflow();

      });

    });
 
  });
  
  describe('Persistent Deselection', function() {

      beforeEach(function() {
        createJobDescription('deselect company', 'deselect company');
      });

      afterEach(function() {
        deleteJobDescription('electrical');
        deleteJobDescription('deselect company');
      });

      it('should allow persistent deselection of personnel after save', function() {

        // search
        element('a[href$="addJobDescription"]').click();
        input('form.company').enter('electrical');
        input('form.position').enter('electrical');
        input('form.similarPosition').enter('electrical');
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(3);

        // deselect one
        element('#acceptable:first').click();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);

        // save it
        element('#addJobDescriptionButton').click();

        // select another job description
        element('*:contains("deselect company")').click();

        // reselect
        element('*:contains("electrical")').click();

        // ensure that deselection is maintained
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);

      });
    });
    
    it('should allow persistent deselection of personnel', function() {

      // search
      element('a[href$="addJobDescription"]').click();
      input('form.similarPosition').enter('ele');
      expect(repeater('input:checkbox:not(:checked)').count()).toBe(3);

      // deselect one
      element('#acceptable:first').click();
      expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);

      // search again
      input('form.similarPosition').enter('elec');

      // ensure that deselection is maintained
      expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);

    });

    it('should ask for a reason when the user is deselected', function() {

      var random = Math.random();

      // search
      element('a[href$="addJobDescription"]').click();
      input('form.similarPosition').enter('ele');
      expect(repeater('#unacceptable:checked').count()).toBe(0);

      // deselect one
      element('#acceptable:first').click();

      // ensure that the history log window is opened
      expect(element('.okCommLogDone:visible').count()).toEqual(1);

      // enter the commlog
      element('[name="commLog.typeEmail"]').click();
      element('[name="commLog.directionIngoing"]').click();
      input('commLog.message').enter('a basic message: ' + random);
      element('.okCommLogDone:visible').click();

      // go to the personnel page and make sure it's there
      element('.text-muted:first').click();

      expect(element('.commLogMessages').text()).toContain('a basic message: ' + random);

      element('a[href$="addJobDescription"]').click();

    });

    it('should save all personnel that have been excluded when creating a job description', function() {
      
      // add a new job description
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('excluder');
      input('form.position').enter('excluder');

      // search
      input('form.similarPosition').enter('ele');
      expect(repeater('#unacceptable:not(:checked)').count()).toBe(0);

      // exclude 3 personnel
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click(); 
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click();
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click();
      expect(repeater('#unacceptable:not(:checked)').count()).toBe(3);
      
      // clear the search, make sure excluded are still there
      input('form.similarPosition').enter('');
      
      expect(repeater('#unacceptable:not(:checked)').count()).toBe(3);

      deleteJobDescription('excluder');
      
    });

    it('should remove personnel that have not yet been touched on re-search', function() {

      // add new
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('remove mostly');
      input('form.position').enter('remove mostly');

      // search
      input('form.similarPosition').enter('ele');

      // exclude someone
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click(); 

      // start a workflow
      element('#workflowProgress').click();
      element('#nextButton').click();

      expect(repeater('#unacceptable:not(:checked)').count()).toBe(1);
      expect(repeater('#acceptable:checked').count()).toBeGreaterThan(1);

      // clear the search
      input('form.similarPosition').enter('');

      expect(repeater('#unacceptable:not(:checked)').count()).toBe(1);
      expect(repeater('#acceptable:checked').count()).toBe(1);

    });

    it('should not remove people from the result list who have been excluded', function() {
      // add new
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('remove mostly');
      input('form.position').enter('remove mostly');

      // search
      input('form.similarPosition').enter('ele');

      // exclude someone
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click(); 

      expect(repeater('#unacceptable:not(:checked)').count()).toBe(1);

      // clear the search
      input('form.similarPosition').enter('');

      expect(repeater('#unacceptable:not(:checked)').count()).toBe(1);
    });

    it('should not remove people from the result list who have a workflow', function() {
      // add new
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('remove mostly');
      input('form.position').enter('remove mostly');

      // search
      input('form.similarPosition').enter('ele');

      // start a workflow
      element('#workflowProgress').click();
      element('#nextButton').click();

      expect(repeater('#acceptable:checked').count()).toBeGreaterThan(1);

      // clear the search
      input('form.similarPosition').enter('');

      expect(repeater('#acceptable:checked').count()).toBe(1);
    });

    it('should not remove people from the result list that have a workflow but have been excluded', function() {
      // add new
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('remove mostly');
      input('form.position').enter('remove mostly');

      // search
      input('form.similarPosition').enter('ele');

      // start a workflow
      element('#workflowProgress').click();
      element('#nextButton').click();

      // exclude someone
      element('#acceptable:first').click();
      element('.okCommLogDone:visible').click(); 

      expect(repeater('#acceptable:checked').count()).toBeGreaterThan(1);

      // clear the search
      input('form.similarPosition').enter('');

      expect(repeater('#unacceptable:not(:checked)').count()).toBe(1);
    });
    
     describe('Remove Results', function() {

      afterEach(function() {
        deleteJobDescription('remove mostly');
      });

      it('should remove the search results on reset', function() {
        // add new
        element('a[href$="addJobDescription"]').click();
        input('form.company').enter('remove mostly');
        input('form.position').enter('remove mostly');

        // search
        input('form.similarPosition').enter('ele');

        // exclude someone
        element('#acceptable:first').click();
        element('.okCommLogDone:visible').click(); 

        // start a workflow
        element('#workflowProgress').click();
        element('#nextButton').click();

        expect(repeater('#acceptable:checked').count()).toBeGreaterThan(1);

        element('a[href$="addJobDescription"]').click();

        expect(repeater('#acceptable:checked').count()).toBe(0);
        expect(repeater('#unacceptable:not(:checked)').count()).toBe(0);
      });

    });
    
        describe('Saved Job Description', function() {

      beforeEach(function() {
        createJobDescription('deselect company', 'Electrical');
      });

      afterEach(function() {
        deleteJobDescription('deselect company');
      });

      it('should make sure that the job description is saved when the user is deselected', function() {

        var random = Math.random();

        // select a job description
        element('a[href$="addJobDescription"]').click();
        element('*:contains("deselect company")').click();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(3);

        // deselect one
        element('#acceptable:first').click();

        // ensure that the history log window is opened
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);

        // enter the commlog 
        element('[name="commLog.typeEmail"]').click();
        element('[name="commLog.directionIngoing"]').click();
        input('commLog.message').enter('a basic message: ' + random);
        element('.okCommLogDone:visible').click();

        // go to the personnel page and make sure it's there
        element('.text-muted:first').click();

        expect(element('.commLogMessages').text()).toContain('a basic message: ' + random);

        // ensure that the deselected position is still deselected
        element('a[href$="addJobDescription"]').click();
        element('*:contains("deselect company")').click();
        expect(repeater('input:checkbox:not(:checked)').count()).toBe(4);
      });

    });

});
describe('Resource', function() {

  describe('CommLog', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });
    
    afterEach(function() {
      deletePersonnel('testname');
      logout();
    });
 
    it('should open the comm log dialog when the button is pressed', function() {
      element('*:contains("testname")').click();
      element('#addCommLogButton').click();
      expect(element('.okCommLogDone:visible').count()).toEqual(1);
      element('.okCommLogDone:visible').click();
      expect(element('.okCommLogDone:visible').count()).toEqual(0);
    });

    it('should open a new comm log dialog with all fields including defaulted values', function() {
      element('*:contains("testname")').click();
      element('#addCommLogButton').click();
      expect(element("[name='commLog.dateEntered']").count()).toEqual(1);
      expect(element("[name='commLog.contact']").count()).toEqual(1);
      expect(element("[name='commLog.contact']").text()).toContain('Greg Lucas-Smith'); // the logged in user
      expect(element("[name='commLog.typeEmail']").count()).toEqual(1);
      expect(element("[name='commLog.typePhone']").count()).toEqual(1);
      expect(element("[name='commLog.directionIngoing']").count()).toEqual(1);
      expect(element("[name='commLog.directionOutgoing']").count()).toEqual(1);
      expect(element("[name='commLog.message']").count()).toEqual(1);
      element('.okCommLogDone:visible').click();
    });

    it('should show a commlog as it is entered on the personnel page', function() {
      element('*:contains("testname")').click();
      element('#addCommLogButton').click();
      input('commLog.message').enter('a simple message');
      element('.okCommLogDone:visible').click();

      var getCount = repeater('#commLogTable').count();
      expect(getCount).toEqual(1);
    });

    it('should show the followup dialog when a commlog is selected', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();
      expect(element('#commLogTitle:visible').text()).toBe('Add a Followup');
    });

    it('should show the followup dialog when a commlog is selected', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();

      expect(element("#commLogMessage").text()).toBe('a basic message');

      expect(element("[name='followup.dateDue']").count()).toEqual(1);
      expect(element("[name='followup.contact']").text()).toContain('greg'); // the logged in user
      expect(element("[name='followup.message']").count()).toEqual(1);    
      expect(element("[name='followup.typeEmail']").count()).toEqual(1); 
      expect(element("[name='followup.typePhone']").count()).toEqual(1); 
    });

    it('should not show too much of the commlog message on followup', function() {
      addCommLog('testname', 'A really long message should be truncated with three dots abcdefghijklmnopqrstuvwxyz');
      element("#addFollowupButton").click();

      expect(element("#commLogMessage").text()).toBe('A really long message should be truncated with three dots a...');
    });

    it('should show the followup on the personnel page', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();
      
      input('followup.message').enter('a followup message');
      element("[name='followup.typeEmail']").click();
      element('.okFollowup:visible').click();

      var getCount = repeater('#followupRow').count();
      expect(getCount).toEqual(1);
      expect(element(".fa-envelope").count()).toEqual(5);
    });

    it('should not open the add followup window when completed is being checked', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();
      
      input('followup.message').enter('a followup message');
      element('.okFollowup:visible').click();
      input('followup.completed').check();

      expect(input('followup.completed').val()).toBe('on');
      expect(element("[name='followup.message']").count()).toEqual(0);
    });

    it('should strike out the text and mark as completed when a followup is completed', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();
      
      input('followup.message').enter('a followup message');
      element('.okFollowup:visible').click();
      input('followup.completed').check();

      expect(input('followup.completed').val()).toBe('on');
      expect(element('.strike').count()).toEqual(3);
    });

    it('should show an error when the date format is incorrect', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();

      input('followup.dateDue').enter('greg');
      expect(element('.text-error:visible').text()).toBe('Make sure the date format is DD/MM/YYYY HH:MM');

      input('followup.dateDue').enter('10/10/2014 10:10');
      expect(element('.text-error:visible').count()).toEqual(0);
    });

    it('should shouldnt allow closing when the date due is invalid', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();

      input('followup.dateDue').enter('greg');
      expect(element('.text-error:visible').text()).toBe('Make sure the date format is DD/MM/YYYY HH:MM');

      element('.okFollowup').click();
      expect(element('.okFollowup:visible').count()).toEqual(1);
    });

    it('should show the logged in user as selected in a followup', function() {
      addCommLog('testname');
      element("#addFollowupButton").click();
      expect(element('.chosen-single').text()).toContain('greg');
    });

  });

});
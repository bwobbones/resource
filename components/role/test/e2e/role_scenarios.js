describe('Resource', function() {
  
  describe('Roles', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });
    
    afterEach(function() {
      deletePersonnel('testname');
      logout();
    });
    
    it('should show and clear the roles modal', function() {
      element('*:contains("testname")').click();
      element('#addRoleButton').click();
      expect(element('.okRolesDone').text()).toContain('Ok');
    });

    it('should be possible to add a role', function() {
      // add a role
      addFullRole();
      var getCount = repeater('#roleTable tr').count();
      expect(getCount).toEqual(4);
    });

    it('should be possible to add two roles', function() {

      // add a role
      element('#addRoleButton').click();
      input('role.roleName').enter('rolename');
      element('.okRolesDone').click();
      expect(element('#roleName-rolename:visible').text()).toContain("rolename");
      var getCount = repeater('#roleTable tr').count();
      expect(getCount).toEqual(2);

      // add another role
      element('#addRoleButton').click();
      input('role.roleName').enter('rolename2');
      element('.okRolesDone').click();
      expect(element('#roleName-rolename2:visible').text()).toContain("rolename2");
      getCount = repeater('#roleTable tr').count();
      expect(getCount).toEqual(3);

    });

    it('should delete a role from a personnel', function() {

      // add a role
      addRole('rolename');

      // delete it
      element('#deleteRoleMessageBox-rolename').click();
      expect(element('#deleteRoleButton').text()).toContain("Ok");
      element('#deleteRoleButton').click();

      // check that the link is there
      expect(element('#noRoles:visible').text()).toContain("No roles have been entered");

    });

    it('should show only experience gained', function() {

      // add a role
      element('#addRoleButton').click();
      input('role.roleName').enter('rolename');
      input('role.newProject').enter('project1');
      element('#addProjectButton').click();
      select('project.projectExperience').option('fpso');
      select('project.phaseExperience').option('engineering');
      element('.okRolesDone').click();
      expect(element('#roleName-rolename:visible').text()).toContain("rolename");
      expect(element('#fpso:visible').text()).toContain("FPSO");
      expect(element('#engineering:visible').text()).toContain("ENG");
      expect(element('.label').count()).toBe(2);

    });

    it('should be possible to edit a role', function() {
      // add a role
      addRole('rolename');

      // edit the role
      element("#roleName-rolename").click();
      input('role.roleName').enter('rolename-edited');
      input('role.newProject').enter('project1');
      element('#addProjectButton').click();
      select('project.projectExperience').option('fpso');
      element('.okRolesDone').click();
      
      expect(element('#roleName-rolename-edited:visible').text()).toContain("rolename-edited");
      expect(element('#fpso:visible').text()).toContain("FPSO");
    });

    it('should show role data in typeaheads', function() {
      // add a role
      addFullRole();

      // save the role
      element('#editPersonnelButton').click();

      element('#addRoleButton').click();

      input('role.roleName').enter('role');
      expect(element('.dropdown-menu').text()).toContain('rolename');
      element('.dropdown-menu').click();
      input('role.client').enter('cli');
      expect(element('.dropdown-menu').text()).toContain('client');
      element('.dropdown-menu').click();
      input('role.newProject').enter('proj');
      expect(element('.dropdown-menu').text()).toContain('project1');
      input('role.newProject').enter('project1');
      element('.dropdown-menu').click();
      element('#addProjectButton').click();
      input('project.location.name').enter('loc');
      expect(element('.dropdown-menu').text()).toContain('location');
      element('.dropdown-menu').click();
      
    }); 

    it('should show local and google typeaheads', function() {
      // add a role
      addFullRole();

      // save the role
      element('#editPersonnelButton').click();

      // edit the location
      element("#roleName-rolename").click();

      // change to local
      input('project.location.name').enter('l');
      element('.dropdown-menu').click();
      input('project.location.name').enter('loc');
      expect(element('.dropdown-menu').text()).toContain('location');
      expect(element('.dropdown-menu').text()).toContain('Lock Airport');
    }); 

    it('should allow creating new roles from the dialog', function() {
      // add a role
      addFullRole();

      // save the role
      element('#editPersonnelButton').click();

      // edit the location
      element("#roleName-rolename").click();
      element(".saveAndNewButton").click();

      expect(input('role.roleName').val()).toBe('');

      input('role.roleName').enter('secondrole');
      element('.okRolesDone').click();

      expect(element('#roleName-rolename:visible').text()).toContain("rolename");
      expect(element('#roleName-secondrole:visible').text()).toContain("secondrole");
      var getCount = repeater('#roleTable tr').count();
      expect(getCount).toEqual(5);
    });

    describe('Roles - validation', function() {

      it('should show validation message when there is an invalid date', function() {
        element('#addRoleButton').click();
        input('role.startDate').enter('greg');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(1);
      });

      it('should not show the validation message when the date is in the correct format', function() {
        element('#addRoleButton').click();
        input('role.startDate').enter('1/1/2010');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);
      });

      it('should not show the validation message when the date is empty', function() {
        element('#addRoleButton').click();
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);
      });

      it('should show all error messages when there are more than 1', function() {
        element('#addRoleButton').click();
        input('role.startDate').enter('greg');
        input('role.endDate').enter('greg');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(2);
      });

      it('should not save the role when there are validation errors', function() {
        element('#addRoleButton').click();
        input('role.startDate').enter('greg');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(1);

        element('.okRolesDone').click();
        getCount = repeater('#roleName:visible').count();
        expect(getCount).toBe(1);
      });

      it('should accept all of the valid date formats', function() {
        element('#addRoleButton').click();

        input('role.startDate').enter('1/1/2010');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);

        input('role.startDate').enter('01/01/2010');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);

        input('role.startDate').enter('Jan 2010');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);

        input('role.startDate').enter('January 2010');
        var getCount = repeater('#dateErrorMessage:visible').count();
        expect(getCount).toBe(0);
      });

    });
    
  });
  
      describe('Personnel Roles', function() {

      it('should show a month duration', function() {
        checkDatesHaveCorrectDuration('1/1/2000', '1/2/2000', 'a month')
      });

      it('should show 2 months duration', function() {
        checkDatesHaveCorrectDuration('1/1/2000', '1/3/2000', '2 months')
      });

      it('should show 2 months duration when using text dates', function() {
        checkDatesHaveCorrectDuration('Jan 2000', 'Mar 2000', '2 months')
      });

      it('should show a year duration', function() {
        checkDatesHaveCorrectDuration('1/1/2000', '1/1/2001', 'a year')
      });

      it('should show 2 years duration', function() {
        checkDatesHaveCorrectDuration('1/1/2000', '1/1/2002', '2 years')
      });

      function checkDatesHaveCorrectDuration(start, end, duration) {
        element('#addRoleButton').click();
        input('role.startDate').enter(start);
        input('role.endDate').enter(end);
        element('.okRolesDone').click();
        expect(element('.yearsPerformed').text()).toBe(duration);
      }

    });
    
        // nav - just the role one then pass it on
    it('should save personnel after dialogs return', function() {

      // create a personnel to move to
      createPersonnel('savingPersonnel', 'savingPersonnel');

      // go back to the tester
      element('*:contains("testname")').click();

      // add and save a role
      addRole('testRole');
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(element('#roleName-testRole:visible').text()).toContain('testRole');

      // add and save a qualification
      addQualification('testQual');
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(element('#qualificationName-testQual:visible').text()).toContain('testQual');

      // add and save a training
      addTraining('testTraining');
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(element('#trainingName-testTraining:visible').text()).toContain('testTraining');

      // add and save an affliation
      addAffiliation('testAffiliation');
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(element('#affiliationName-testAffiliation:visible').text()).toContain('testAffiliation');

      // add and save a commlog
      addCommLog('testname', 'testCommlog');
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(repeater('#commLogTable').count()).toEqual(1);

      // add and save a followup
      element("#addFollowupButton").click();      
      input('followup.message').enter('a followup message');
      element("[name='followup.typeEmail']").click();
      element('.okFollowup:visible').click();
      element('*:contains("savingPersonnel")').click();
      element('*:contains("testname")').click();
      expect(repeater('#followupRow').count()).toEqual(1);

      deletePersonnel('savingPersonnel');
    });
    
        // nav
    it('should create a new personnel when a role is created', function() {

      // put a new personnel name in 
      element('a[href$="addPersonnel"]').click();
      input('form.name').enter('newPersonnel');

      // add role
      addRole('newRole');

      // verify that the new personnel was saved with it's role
      element('*:contains("testname")').click();
      element('*:contains("newPersonnel")').click();

      expect(element('#roleName-newRole:visible').text()).toContain('newRole');

      deletePersonnel('newPersonnel');
    });
    
       describe('Personnel Saving', function() {

      afterEach(function() {
        deletePersonnel('SavingPersonnel');
      });

      // nav
      it('should only save a personnel once', function() {

        // enter a name and a surname
        element('a[href$="addPersonnel"]').click();
        input('form.name').enter('SavingPersonnel');
        input('form.surname').enter('SavingPersonnel');

        // add a role
        element('#addRoleButton').click();
        input('role.roleName').enter('testRole');
        element('.okRolesDone').click();
        expect(element('#roleName-testRole:visible').text()).toContain('testRole');

        // make sure there's only one in the list
        var promise = element('.personnelList').query(function(selectedElements, done) {
          var personnelCount = _.countBy(selectedElements, function(personnel) {
            return personnel.textContent.match(/.*SavingPersonnel, SavingPersonnel.*/) ? "In" : "Out";
          });
          done(null, personnelCount.In);
        });
        expect(promise).toBe(1);

      });

      // nav
      it('should only save a personnel once even when a role is added before saving', function() {

        // enter a name and a surname
        element('a[href$="addPersonnel"]').click();
        input('form.name').enter('SavingPersonnel');
        input('form.surname').enter('SavingPersonnel');

        // add a role
        element('#addRoleButton').click();
        input('role.roleName').enter('testRole');
        element('.okRolesDone').click();
        expect(element('#roleName-testRole:visible').text()).toContain('testRole');

        // add a role
        element('#addRoleButton').click();
        input('role.roleName').enter('testRole2');
        element('.okRolesDone').click();
        expect(element('#roleName-testRole2:visible').text()).toContain('testRole2');

        // make sure there's only one in the list
        var promise = element('.personnelList').query(function(selectedElements, done) {
          var personnelCount = _.countBy(selectedElements, function(personnel) {
            return personnel.textContent.match(/.*SavingPersonnel, SavingPersonnel.*/) ? "In" : "Out";
          });
          done(null, personnelCount.In);
        });
        expect(promise).toBe(1);

      });

    });
  
});

function addFullRole() {
  element('#addRoleButton').click();
  input('role.roleName').enter('rolename');
  input('role.client').enter('client');
  input('role.newProject').enter('project1');
  element('#addProjectButton').click();
  input('project.location.name').enter('location');
  select('project.projectExperience').options('offOG', 'onOG', 'fpso', 'lng', 'eeha', 'other');
  select('project.phaseExperience').options('administration', 'engineering', 'procurement', 
    'construction', 'installation', 'commissioning', 'opsmaint', 'decommissioning', 'shutdown');
  input('role.newProject').enter('project2');
  element('#addProjectButton').click();
  element('.okRolesDone').click();
  expect(element('#roleName-rolename:visible').text()).toContain('rolename');
  expect(element('#offOG:visible').text()).toContain("OFF");
  expect(element('#onOG:visible').text()).toContain("ON");
  expect(element('#fpso:visible').text()).toContain("FPSO");
  expect(element('#lng:visible').text()).toContain("LNG"); 
  expect(element('#other:visible').text()).toContain("OTH"); 
  expect(element('#administration:visible').text()).toContain("ADM");
  expect(element('#engineering:visible').text()).toContain("ENG");
  expect(element('#procurement:visible').text()).toContain("PRO");
  expect(element('#construction:visible').text()).toContain("CON");
  expect(element('#installation:visible').text()).toContain("INS");
  expect(element('#commissioning:visible').text()).toContain("COM");
  expect(element('#opsmaint:visible').text()).toContain("OPS");
  expect(element('#decommissioning:visible').text()).toContain("DEC");
  expect(element('#shutdown:visible').text()).toContain("SHD");
}

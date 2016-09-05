var _ = require('../../../bower_components/lodash/lodash.js')

var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelRolePage = require('../../../common/test/e2e/pages/personnelRolePage.js');

require('events').EventEmitter.prototype._maxListeners = 100;

fdescribe('Resource', function() {
  
  describe('Roles', function() {
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var personnelPage = new PersonnelPage();
    var personnelRolePage = new PersonnelRolePage();

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
      personnelRolePage.visitPage();
    });

    afterEach(function() {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });

    it('should show and clear the roles modal', function() {
      personnelRolePage.clickAddRoleButton();
      expect(element(by.className('modal-dialog')).isDisplayed()).toBe(true);
    });

    it('should be possible to add a role', function() {
      addFullRole();
      var count = element.all(by.id('roleTable tr')).count();
      expect(count).toEqual(2);
    });

    it('should be possible to add two roles', function() {
      personnelRolePage.clickAddRoleButton();
      personnelRolePage.enterRoleName('rolename1');
      personnelRolePage.clickOkRolesDone();
      expect(element(by.id('roleName-rolename1')).getText()).toBe('rolename1');
      
      element.all(by.id('addRoleButton')).last().click();
      personnelRolePage.enterRoleName('rolename2');
      personnelRolePage.clickOkRolesDone();
      expect(element(by.id('roleName-rolename2')).getText()).toBe('rolename2');
    });

    it('should delete a role from a personnel', function() {
      personnelRolePage.clickAddRoleButton();
      personnelRolePage.enterRoleName('rolename');
      personnelRolePage.clickOkRolesDone();

      expect(element(by.id('roleName-rolename')).getText()).toBe('rolename');

      element(by.id('deleteRoleMessageBox-rolename')).click();
      expect(element(by.className('modal-dialog')).isDisplayed()).toBe(true);
      element(by.id('deleteRoleButton')).click();
      
      expect(element(by.id('noRoles')).isDisplayed()).toBe(true);
    });

    xit('should show only experience gained', function() {
      // currently mining specific experience is shown
    });

    it('should be possible to edit a role', function() {
      personnelRolePage.clickAddRoleButton();
      personnelRolePage.enterRoleName('rolename');
      personnelRolePage.clickOkRolesDone();

      element(by.id('roleName-rolename')).click();
      personnelRolePage.clearRoleName();
      personnelRolePage.enterRoleName('rolename-edited');
      personnelRolePage.enterNewProject('project1');
      personnelRolePage.clickAddProjectButton();
      personnelRolePage.clickOkRolesDone();

      expect(element(by.id('roleName-rolename-edited')).getText()).toBe('rolename-edited');
      // expect(element.all(by.id('projectTable tr')).count()).toBe(1);
      // TODO find a way to get the project name
    });

    it('should show role data in typeaheads', function() {
      
    });

    it('should show local and google typeaheads', function() {
      // if this is making a request, it could be a brittle test because
      // it is dependent on Google
    }); 

    it('should allow creating new roles from the dialog', function() {
      
    });

    describe('Roles - validation', function() {
      fit('should show validation message when there is an invalid date', function() {
        personnelRolePage.clickAddRoleButton();
        personnelRolePage.enterStartDate('greg');
        browser.pause(5859);
        // need to filter by displayed
        expect(element.all(by.id('dateErrorMessage')).count()).toBe(1);
        
        // element('#addRoleButton').click();
        // input('role.startDate').enter('greg');
        // var getCount = repeater('#dateErrorMessage:visible').count();
        // expect(getCount).toBe(1);
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
    
    function addFullRole() {
      personnelRolePage.clickAddRoleButton();
      personnelRolePage.enterRoleName('rolename');
      personnelRolePage.enterClient('client');
      personnelRolePage.enterStartDate('01/01/2016'); // Don't know if dates in tests are too brittle
      personnelRolePage.enterEndDate('01/01/2017');
      personnelRolePage.enterNewProject('project1');
      personnelRolePage.clickAddProjectButton();
      personnelRolePage.enterProjectLocation('location');
      personnelRolePage.enterNewProject('project2');
      personnelRolePage.clickAddProjectButton();
      personnelRolePage.clickOkRolesDone();
    }
  });
});


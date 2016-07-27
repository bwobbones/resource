var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainPersonnelPage = require('../../../common/test/e2e/pages/mainPage.personnel.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');

describe('personnel', function() {

  describe('delete', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var mainPersonnelPage = new MainPersonnelPage();
    var personnelPage = new PersonnelPage();

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
    });

    afterEach(function() {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });
    
    it('should cancel the deletion of a personnel', function(done) {
      personnelPage.clickDeletePersonnel();
      personnelPage.clickCancelDelete();
      mainPersonnelPage.verifyPersonnelExists('testname');
      done();
    });
    
    it('should delete a personnel', function(done) {
      personnelPage.createPersonnel('deletePersonnel', 'deletePersonnel');
      mainPersonnelPage.verifyPersonnelExists('deletePersonnel');
      
      mainPage.visitHome();
      mainPersonnelPage.editPersonnel('deletePersonnel');
      personnelPage.clickDeletePersonnel();
      personnelPage.clickOkDelete();
      
      mainPage.visitHome();
      mainPersonnelPage.findPersonnel('deletePersonnel');
      expect(element.all(by.repeater('row in displayedPersonnel')).count()).toBe(0);
      done();
    });

  });

});
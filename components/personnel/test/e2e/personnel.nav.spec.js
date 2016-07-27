var DirtyPersonnelModalPage = require('../../../common/test/e2e/pages/dirtyPersonnelModalPage.js');
var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelPersonalPage = require('../../../common/test/e2e/pages/personnelPersonalPage.js');

describe('personnel', function() {

  describe('nav', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var personnelPage = new PersonnelPage();
    var personnelPersonalPage = new PersonnelPersonalPage();
    var dirtyPersonnelModalPage = new DirtyPersonnelModalPage();

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
    });

    afterEach(function() {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });
    
    it('should not allow user to move from page until page is saved', function(done) {

      // now we change testname
      personnelPersonalPage.clearSurname();
      personnelPersonalPage.enterSurname('testsurname');

      // and we shouldn't be able to move to dirtymove any more
      mainPage.visitHome();
      expect(element(by.id('okDirtyPersonnel')).isPresent()).toBe(true);
      dirtyPersonnelModalPage.clickCancel();
      expect(element(by.model('form.surname')).getAttribute('value')).toEqual('testsurname');
      personnelPersonalPage.clearSurname();
      personnelPersonalPage.enterSurname('testname');
      
      // then we save testname and moving should be possible again
      personnelPage.clickEditPersonnel();
      mainPage.visitHome();
      expect(element(by.id('okDirtyPersonnel')).isPresent()).toBe(false);
      done();

    }); 

  });

});
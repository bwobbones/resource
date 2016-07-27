var DirtyPersonnelModalPage = require('../../../common/test/e2e/pages/dirtyPersonnelModalPage.js');
var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelPersonalPage = require('../../../common/test/e2e/pages/personnelPersonalPage.js');

describe('index', function() {

  describe('search', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
    });

    afterEach(function() {
      mainPage.logout();
    });
    
    it('should allow the entry of search terms', function() {
      mainPage.enterSearchText('hello');
      expect(element(by.model('form.searchTerms')).getAttribute('value')).toBe('hello');
    });
    
    // it('should be possible to navigate through the jobs to their workflow', function() {
    //   mainPage.enterSearchText()
    // });

  });

});
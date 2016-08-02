var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var RegistrationPage = require('../../../common/test/e2e/pages/registrationPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainPersonnelPage = require('../../../common/test/e2e/pages/mainPage.personnel.js');

describe('resource', function() {
  
  describe('registration', function() {
    
    var loginPage = new LoginPage();
    var registrationPage = new RegistrationPage();
    var mainPage = new MainPage();
    var mainPersonnelPage = new MainPersonnelPage();

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.clickRegisterLink();
    });

    afterEach(function() {
      mainPage.logout();
    });

    it('should be possible to register a new user', function() {
      registrationPage.enterFullName('Test User');
      registrationPage.enterUsername('testuser1');
      registrationPage.enterPassword('password');
      registrationPage.enterConfirm('password');
      registrationPage.register();

      expect(element(by.id('loggedInUser')).getText()).toBe('Test User');
    });

    it('should be possible to register a 2 new users and have their data segregated', function(done) {

      // register the first user
      registrationPage.enterFullName('Test User 1');
      registrationPage.enterUsername('testuser1');
      registrationPage.enterPassword('password');
      registrationPage.enterConfirm('password');
      registrationPage.register();
      expect(element(by.id('loggedInUser')).getText()).toBe('Test User 1');

      // create a personnel
      element(by.id('addPersonnelLink')).click();
      element(by.model('form.name')).sendKeys('Test');
      element(by.model('form.surname')).sendKeys('User1');
      element(by.id('addPersonnelButton')).click();
      
      // search for personnel, confirm exists
      mainPersonnelPage.verifyPersonnelExists('User1');

      // register the second user
      mainPage.logout();
      loginPage.clickRegisterLink();
      registrationPage.enterFullName('Test User 2');
      registrationPage.enterUsername('testuser2');
      registrationPage.enterPassword('password');
      registrationPage.enterConfirm('password');
      registrationPage.register();
      expect(element(by.id('loggedInUser')).getText()).toBe('Test User 2');

      // create a personnel
      element(by.id('addPersonnelLink')).click();
      element(by.model('form.name')).sendKeys('Test');
      element(by.model('form.surname')).sendKeys('User2');
      element(by.id('addPersonnelButton')).click();
      
      // search for personnel, confirm exists
      mainPersonnelPage.verifyPersonnelExists('User2');
      
      // login as first user
      mainPage.visitPage();
      mainPage.logout();
      loginPage.enterCredentials('testuser1', 'password');
      expect(element(by.id('loggedInUser')).getText()).toBe('Test User 1');

      // search for second user personnel, confirm doesn't exist
      mainPersonnelPage.findPersonnel('User2');
		  expect(element(by.id('searchResults')).getText()).toBe('There are no search results...');

      done();
    });
    
  });

});
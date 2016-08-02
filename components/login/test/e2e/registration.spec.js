var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var RegistrationPage = require('../../../common/test/e2e/pages/registrationPage.js');
// var EditProfilePage = require('../../../common/test/e2e/pages/editProfilePage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');

fdescribe('resource', function() {
  
  describe('registration', function() {
    
    var loginPage = new LoginPage();
    var registrationPage = new RegistrationPage();
    // var editProfilePage = new EditProfilePage();
    var mainPage = new MainPage();

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

    xit('should be possible to register a 2 new users and have their data segregated', function() {

    });
    
  });

});
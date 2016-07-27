var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var EditProfilePage = require('../../../common/test/e2e/pages/editProfilePage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');

describe('resource', function() {
  
  describe('login', function() {
    
    var loginPage = new LoginPage();
    var editProfilePage = new EditProfilePage();
    var mainPage = new MainPage();

    beforeEach(function () {
      loginPage.visitPage();
    });

    afterEach(function() {
     
    });
    
    it('should not allow a user with bad password to log in', function() {
      loginPage.enterCredentials('greg', 'badPassword');
      //expect(element(by.id('loginError')).getText()).toContain('The username and password you entered don\'t match.');
      expect(element(by.id('loginButton')).getAttribute('value')).toContain('Login');
    });
    
    it('should not allow a user with bad username to log in', function() {
      loginPage.enterCredentials('badUser', 'greg');
      //expect(element(by.id('loginError')).getText()).toContain('The username and password you entered don\'t match.');
      expect(element(by.id('loginButton')).getAttribute('value')).toContain('Login');
    });

    it('should allow the user to reset their password', function () {

      //login
      loginPage.enterCredentials('greg', 'greg');

      // reset to bob
      editProfilePage.visitPage();
      editProfilePage.clearFields();
      editProfilePage.updatePassword('bob', 'bob');

      // logout and login with new password
      mainPage.logout();
      loginPage.clearFields();
      loginPage.enterCredentials('greg', 'bob');

      // reset back to normal
      editProfilePage.visitPage();
      editProfilePage.clearFields();
      editProfilePage.updatePassword('greg', 'greg');
      
      expect(element(by.id('loggedInUser')).getText()).toContain("Greg Lucas-Smith");
      mainPage.logout();
    });
    
    it('should not be possible to reset the password when new password is not entered twice', function() {
      loginPage.enterCredentials('greg', 'greg');
      editProfilePage.visitPage();
      editProfilePage.enterPassword('greg');
      editProfilePage.submit();
      expect(element(by.id('resetOkButton')).getAttribute('value')).toEqual('Save Profile');
    });     
    
    it('should not be possible to reset the password when new password is different to confirmed password', function() {
      loginPage.enterCredentials('greg', 'greg');
      editProfilePage.visitPage();
      editProfilePage.enterPassword('bob');
      editProfilePage.confirmPassword('bobcat');
      editProfilePage.submit();
      expect(element(by.id('resetOkButton')).getAttribute('value')).toEqual('Save Profile');
    });
    
  });

});
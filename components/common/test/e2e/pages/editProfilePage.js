var EditProfilePage = (function() {
  function EditProfilePage() {
    this.newPasswordField = by.model('user.password');
    this.confirmPasswordField = by.model('confirmpassword');
    this.submitButton = by.id('resetOkButton');
  }

  EditProfilePage.prototype.visitPage = function() {
    browser.driver.sleep(1500);
    element(by.id('jobTitleLink')).click();
    element(by.id('editProfileButton')).click();
  };

  EditProfilePage.prototype.enterPassword = function(password) {
    element(this.newPasswordField).sendKeys(password);
  };

  EditProfilePage.prototype.confirmPassword = function(confirmPassword) {
    element(this.confirmPasswordField).sendKeys(confirmPassword);
  };

  EditProfilePage.prototype.submit = function() {
    element(this.submitButton).click();
  };

  EditProfilePage.prototype.updatePassword = function(password, confirmPassword) {
    this.enterPassword(password);
    this.confirmPassword(confirmPassword);
    this.submit();
  }
  
  EditProfilePage.prototype.clearFields = function() {
    element(this.newPasswordField).clear();
    element(this.confirmPasswordField).clear();
  }

  return EditProfilePage;

})();

module.exports = EditProfilePage; 
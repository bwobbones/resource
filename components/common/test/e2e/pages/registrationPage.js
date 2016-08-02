var RegistrationPage = (function () {
  function RegistrationPage() {
    this.fullNameField = by.model('registrationForm.fullname');
    this.usernameField = by.model('registrationForm.username');
    this.passwordField = by.model('registrationForm.password');
    this.confirmField = by.model('registrationForm.confirm');
    this.registerButton = by.id('registerButton');
  }

  RegistrationPage.prototype.visitPage = function () {
     browser.get('http://localhost:9200/register');
  };

  RegistrationPage.prototype.enterFullName = function (fullname) {
    element(this.fullNameField).sendKeys(fullname);
  };

  RegistrationPage.prototype.enterUsername = function (username) {
    element(this.usernameField).sendKeys(username);
  };

  RegistrationPage.prototype.enterPassword = function (password) {
    element(this.passwordField).sendKeys(password);
  };

  RegistrationPage.prototype.enterConfirm = function (confirm) {
    element(this.confirmField).sendKeys(confirm);
  };

  RegistrationPage.prototype.register = function () {
    element(this.registerButton).click();
  };

  RegistrationPage.prototype.clearFields = function () {
    element(this.fullNameField).clear();
    element(this.usernameField).clear();
    element(this.passwordField).clear();
    element(this.confirmField).clear();
  }

  return RegistrationPage;

})();

module.exports = RegistrationPage; 
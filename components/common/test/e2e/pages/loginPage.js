var LoginPage = (function () {
  function LoginPage() {
    this.usernameField = by.model('loginForm.username');
    this.passwordField = by.model('loginForm.password');
    this.loginButton = by.id('loginButton');
  }

  LoginPage.prototype.visitPage = function () {
     browser.get('http://localhost:9200/loginUser');
  };

  LoginPage.prototype.enterUsername = function (username) {
    element(this.usernameField).sendKeys(username);
  };

  LoginPage.prototype.enterPassword = function (password) {
    element(this.passwordField).sendKeys(password);
  };

  LoginPage.prototype.login = function () {
    element(this.loginButton).click();
  };

  LoginPage.prototype.enterCredentials = function (username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.login();
  }

  LoginPage.prototype.clearFields = function () {
    element(this.usernameField).clear();
    element(this.passwordField).clear();
  }

  return LoginPage;

})();

module.exports = LoginPage; 
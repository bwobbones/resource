var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var RegistrationPage = require('../../../common/test/e2e/pages/registrationPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelContactPage = require('../../../common/test/e2e/pages/personnelContactPage.js');

var until = protractor.ExpectedConditions;

describe('personnel', function() {

  describe('maps', function () {
    
    var loginPage = new LoginPage();
    var registrationPage = new RegistrationPage();
    var mainPage = new MainPage();
    var personnelPage = new PersonnelPage();
    var personnelContactPage = new PersonnelContactPage();

    beforeAll(function() {
      loginPage.visitPage();
      loginPage.clickRegisterLink();
      registrationPage.registerUser('greg', 'greg', 'greg');
    });

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
    });

    afterEach(function() {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });
    
    it('should not show the google map if home address is not set', function(done) {
      personnelContactPage.visitPage();
      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(false);
      done();
    });

    it('should show google map if home address is set', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHcaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();

      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(true);
      done();
    });
    
    it('should remove the google map when the home address is set to nothing', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHcaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();
      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(true);
      
      personnelContactPage.clearHcaddress();
      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(false);
      done();
    });
    
    it('should show google map if host address is set', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHsaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();

      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(true);
      done();
    });
    
    it('should remove the google map when the host address is set to nothing', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHsaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();
      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(true);
      
      personnelContactPage.clearHsaddress();
      expect(element(by.tagName('ui-gmap-google-map')).isPresent()).toBe(false);
      done();
    });
    
    it('should show home and host maps at the same time', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHcaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();
      expect(element.all(by.tagName('ui-gmap-google-map')).count()).toBe(1);

      personnelContactPage.visitPage();
      personnelContactPage.enterHsaddress('20 Minerva Loop, Success');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('20 Minerva Loop, Success');
      element(by.css('a[tabindex="-1"]')).click();
      expect(element.all(by.tagName('ui-gmap-google-map')).count()).toBe(2);
      done();
    });
    
    it('should show a local locale', function(done) {
      personnelContactPage.visitPage();
      personnelContactPage.enterHcaddress('Newcastle');
      expect(element(by.css('a[tabindex="-1"]')).getText()).toContain('NSW');
      done();
    });

  });

});
var _ = require('../../../bower_components/lodash/lodash.js')

var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var RegistrationPage = require('../../../common/test/e2e/pages/registrationPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainPersonnelPage = require('../../../common/test/e2e/pages/mainPage.personnel.js');
var PersonnelContactPage = require('../../../common/test/e2e/pages/personnelContactPage.js');
var PersonnelQualificationPage = require('../../../common/test/e2e/pages/personnelQualificationPage.js');
var PersonnelEmergencyPage = require('../../../common/test/e2e/pages/personnelEmergencyPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelPersonalPage = require('../../../common/test/e2e/pages/personnelPersonalPage.js');

require('events').EventEmitter.prototype._maxListeners = 100;

describe('personnel', function () {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

  describe('create', function () {

    var loginPage = new LoginPage();
    var registrationPage = new RegistrationPage();
    var mainPage = new MainPage();
    var mainPersonnelPage = new MainPersonnelPage();
    var personnelQualificationPage = new PersonnelQualificationPage();
    var personnelPage = new PersonnelPage();

    beforeAll(function () {
      loginPage.visitPage();
      loginPage.clickRegisterLink();
      registrationPage.registerUser('greg', 'greg', 'greg');
    });

    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
      mainPersonnelPage.findPersonnel('testname');
      mainPersonnelPage.editPersonnel('testname');
      personnelQualificationPage.visitPage();
    });

    afterAll(function () {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });
       
    it('should Add then update Qualification', function (done) {
      personnelQualificationPage.gotoAddQualification();
      processQualification("Q111", "02/12/2013", "03/12/2013", "C111", "I111", 1);

      personnelQualificationPage.gotoAddQualification();
      processQualification("Q222", "02/12/2014", "03/12/2014", "C222", "I222", 2);

      personnelQualificationPage.selectNthQualification(2);
      processQualification("Q333", "02/12/2014", "03/12/2014", "C333", "I333", 2);
      // personnelQualificationPage.deleteNthQualification(1);
      done();
    });

    function processQualification(name, dateObtained, expiryDate, certificate, institution, count) {

      personnelQualificationPage.clearThenEnterQualificationname(name);
      personnelQualificationPage.clearThenEnterQualificationdateObtained(dateObtained);
      personnelQualificationPage.clearThenEnterQualificationexpiryDate(expiryDate);
      personnelQualificationPage.clearThenEnterQualificationcertificateNumber(certificate);
      personnelQualificationPage.clearThenEnterQualificationinstitution(institution)

      personnelQualificationPage.gotoOkQualificationDone();
      expect(element.all(by.repeater('qualification in form.qualifications')).count()).toBe(count);

      personnelQualificationPage.selectNthQualification(count);

      expect(personnelQualificationPage.getQualificationname()).toEqual(name);
      expect(personnelQualificationPage.getQualificationdateObtained()).toEqual(dateObtained);
      expect(personnelQualificationPage.getQualificationexpiryDate()).toEqual(expiryDate);
      expect(personnelQualificationPage.getQualificationcertificateNumber()).toEqual(certificate);
      expect(personnelQualificationPage.getQualificationinstitution()).toEqual(institution);

      personnelQualificationPage.gotoCancelAddQualification();
    }

    it('should add then update Affilation', function (done) {
      personnelQualificationPage.gotoAddAffiliation();
      processAffiliation("A101", "Level1", 1);

      personnelQualificationPage.gotoAddAffiliation();
      processAffiliation("A102", "Level2", 2);

      personnelQualificationPage.selectNthAffiliation(2);
      processAffiliation("A333", "Level3", 2);

      done();
    });

    function processAffiliation(name, level, count) {
      personnelQualificationPage.clearThenEnterAffiliationname(name);
      personnelQualificationPage.clearThenEnterAffiliationlevel(level);

      personnelQualificationPage.gotoOkAffiliationDone();
      expect(element.all(by.repeater('affiliation in form.affiliation')).count()).toBe(count);

      personnelQualificationPage.selectNthAffiliation(count);

      expect(personnelQualificationPage.getAffiliationname()).toEqual(name);
      expect(personnelQualificationPage.getAffiliationlevel()).toEqual(level);

      personnelQualificationPage.gotoCancelAddAffiliation();
    }

    it('should Add then update Training', function (done) {
      personnelQualificationPage.gotoAddTraining();
      processTraining("TR1", "11/12/2014", "25/12/2014", "cert1", "inst1", 1);

      personnelQualificationPage.gotoAddTraining();
      processTraining("TR2", "11/12/2015", "25/12/2015", "cert2", "inst2", 2);

      personnelQualificationPage.selectNthTraining(2);
      processTraining("TR3", "11/12/2015", "25/12/2015", "cert3", "inst3", 2);

      done();
    });

    function processTraining(name, dateObtained, expiryDate, certificateNumber,
      institution, count) {
      personnelQualificationPage.clearThenEnterTrainingname(name);
      personnelQualificationPage.clearThenEnterTrainingdateObtained(dateObtained);
      personnelQualificationPage.clearThenEnterTrainingexpiryDate(expiryDate);
      personnelQualificationPage.clearThenEnterTrainingcertificateNumber(certificateNumber);
      personnelQualificationPage.clearThenEnterTraininginstitution(institution);

      personnelQualificationPage.gotoOkTrainingDone();
      expect(element.all(by.repeater('training in form.training')).count()).toBe(count);

      personnelQualificationPage.selectNthTraining(count);

      expect(personnelQualificationPage.getTrainingname()).toEqual(name);
      expect(personnelQualificationPage.getTrainingdateObtained()).toEqual(dateObtained);
      expect(personnelQualificationPage.getTrainingexpiryDate()).toEqual(expiryDate);
      expect(personnelQualificationPage.getTrainingcertificateNumber()).toEqual(certificateNumber);
      expect(personnelQualificationPage.getTraininginstitution()).toEqual(institution);

      personnelQualificationPage.gotoCancelAddTraining();
    }

  });

});
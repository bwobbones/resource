var _ = require('../../../bower_components/lodash/lodash.js')

var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainPersonnelPage = require('../../../common/test/e2e/pages/mainPage.personnel.js');
var PersonnelContactPage = require('../../../common/test/e2e/pages/personnelContactPage.js');
var PersonnelEmergencyPage = require('../../../common/test/e2e/pages/personnelEmergencyPage.js');
var PersonnelPage = require('../../../common/test/e2e/pages/personnelPage.js');
var PersonnelPersonalPage = require('../../../common/test/e2e/pages/personnelPersonalPage.js');

require('events').EventEmitter.prototype._maxListeners = 100;

describe('personnel', function() {
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

  describe('create', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var mainPersonnelPage = new MainPersonnelPage();
    var personnelContactPage = new PersonnelContactPage();
    var personnelEmergencyPage = new PersonnelEmergencyPage();
    var personnelPage = new PersonnelPage();
    var personnelPersonalPage = new PersonnelPersonalPage();
    
    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      personnelPage.createPersonnel('testname', 'testname');
    });

    afterEach(function() {
      personnelPage.removePersonnel('testname');
      mainPage.logout();
    });
    
    it('should create a personnel and find them in the search list', function(done) {
      mainPersonnelPage.findPersonnel('testname');
      expect(element.all(by.repeater('row in displayedPersonnel')).get(0).getText()).toContain('testname');
      done();
    });
    
    it('should not be possible to remove the name field from a personnel', function(done) {
      // enter some info into a field, remove the name and save it
      personnelContactPage.visitPage();
      personnelContactPage.enterHcmobile('0123456789');
      personnelPersonalPage.visitPage();
      personnelPersonalPage.clearName();
      expect(element(by.id('noNameErrorMessage')).getText()).toEqual('This field is required');
      personnelPage.clickEditPersonnel();

      // reload the edited item and ensure that the edited field is not there
      mainPage.visitPage();
      mainPersonnelPage.editPersonnel('testname');
      personnelContactPage.visitPage();
      expect(personnelContactPage.getHcmobile()).toEqual('');
      done();
    });
    
    it('should edit a personnel and update the search list', function(done) {
      personnelPage.createPersonnel('updatePersonnel', 'updatePersonnel');
      personnelPersonalPage.clearSurname();
      personnelPersonalPage.enterSurname('updatePersonnel-updated');
      personnelPage.clickEditPersonnel();
      mainPersonnelPage.verifyPersonnelExists('updatePersonnel-updated');
      personnelPage.removePersonnel('updatePersonnel-updated');
      done();
    });
    
    it('should fill an entire personnel with personal data which is retrievable', function(done) {
      personnelPersonalPage.visitPage();
      personnelPersonalPage.enterAvailabledate('02/12/2014');
      personnelPersonalPage.enterDateofbirth('02/12/2014');
      personnelPersonalPage.enterSource('facebook');
      personnelPersonalPage.toggleValidated();
      personnelPersonalPage.enterPreferredname('preferredName');
      personnelPersonalPage.enterReferrer('referrer');
      personnelPersonalPage.enterProject('project');
      personnelPersonalPage.toggleCurrentlyemployed();
      personnelPersonalPage.enterNoticeperiod('4 weeks');
      personnelPersonalPage.toggleRightToWork();
      personnelPersonalPage.enterOccupation('brickie');
      personnelPersonalPage.enterNationality('australian');
      personnelPersonalPage.enterCitizenship('australian');
      personnelPersonalPage.enterPassportnumber('brickie');
      personnelPersonalPage.enterPassportexpiry('02/12/2014');
      personnelPersonalPage.toggleHoldsvisa();
      personnelPersonalPage.enterVisatype('australian');
      personnelPersonalPage.enterVisaholder('australian');
      personnelPersonalPage.enterVisastartdate('02/12/2014');
      personnelPersonalPage.enterVisaenddate('02/12/2014');
      personnelPersonalPage.enterSummary('summary text');
      
      personnelPage.clickEditPersonnel();
      mainPage.visitPage();
      mainPersonnelPage.editPersonnel('testname');
      
      personnelPersonalPage.visitPage();
      expect(personnelPersonalPage.getAvailabledate()).toEqual('02/12/2014');
      expect(personnelPersonalPage.getDateofbirth()).toEqual('02/12/2014');
      expect(personnelPersonalPage.getSource()).toEqual('facebook');
      expect(personnelPersonalPage.getValidated()).toBeTruthy();
      expect(personnelPersonalPage.getPreferredname()).toEqual('preferredName');
      expect(personnelPersonalPage.getReferrer()).toEqual('referrer');
      expect(personnelPersonalPage.getProject()).toEqual('project');
      expect(personnelPersonalPage.getCurrentlyemployed()).toBeTruthy();
      expect(personnelPersonalPage.getNoticeperiod()).toEqual('4 weeks');
      expect(personnelPersonalPage.getRightToWork()).toBeFalsy();
      expect(personnelPersonalPage.getOccupation()).toEqual('brickie');
      expect(personnelPersonalPage.getNationality()).toEqual('australian');
      expect(personnelPersonalPage.getCitizenship()).toEqual('australian');
      expect(personnelPersonalPage.getPassportnumber()).toEqual('brickie');
      expect(personnelPersonalPage.getPassportexpiry()).toEqual('02/12/2014');
      expect(personnelPersonalPage.getHoldsvisa()).toBeTruthy();
      expect(personnelPersonalPage.getVisatype()).toEqual('australian');
      expect(personnelPersonalPage.getVisaholder()).toEqual('australian');
      expect(personnelPersonalPage.getVisastartdate()).toEqual('02/12/2014');
      expect(personnelPersonalPage.getVisaenddate()).toEqual('02/12/2014');
      expect(personnelPersonalPage.getSummary()).toEqual('summary text');
      done();
    });
    
    it('should fill an entire personnel with contact data which is retrievable', function(done) {
      
      personnelContactPage.visitPage();
      personnelContactPage.enterHcaddress('20 Minerva Loop');
      personnelContactPage.enterHchomephone('0123456789');
      personnelContactPage.enterHcmobile('012345678');      
      personnelContactPage.enterHcemail('bwobbones@gmail.com');
      personnelContactPage.enterNearestairport('perth');
      personnelContactPage.enterHsaddress('20 Minerva Loop');
      personnelContactPage.enterHshomephone('01234567');
      personnelContactPage.enterHsmobile('0123456');
      
      personnelPage.clickEditPersonnel();
      mainPage.visitPage();
      mainPersonnelPage.editPersonnel('testname');
      
      personnelContactPage.visitPage();
      expect(personnelContactPage.getHcaddress()).toEqual('20 Minerva Loop');
      expect(personnelContactPage.getHchomephone()).toEqual('0123456789');
      expect(personnelContactPage.getHcmobile()).toEqual('012345678');
      expect(personnelContactPage.getHcemail()).toEqual('bwobbones@gmail.com');
      expect(personnelContactPage.getHsaddress()).toEqual('20 Minerva Loop');
      expect(personnelContactPage.getHshomephone()).toEqual('01234567');
      expect(personnelContactPage.getHsmobile()).toEqual('0123456');
      expect(personnelContactPage.getNearestairport()).toEqual('perth');
      done();
    });


    it('should fill an entire personnel with emergency data which is retrievable', function(done) {
     
      personnelEmergencyPage.visitPage();
      personnelEmergencyPage.enterEmergency1name('greg');
      personnelEmergencyPage.enterEmergency1relationship('father');
      personnelEmergencyPage.enterEmergency1phone('phone');
      personnelEmergencyPage.enterEmergency1mobile('mobile');
      personnelEmergencyPage.enterEmergency1email('email');
      personnelEmergencyPage.enterEmergency1address('address');
      personnelEmergencyPage.enterEmergency2name('greg');
      personnelEmergencyPage.enterEmergency2relationship('father');
      personnelEmergencyPage.enterEmergency2phone('phone');
      personnelEmergencyPage.enterEmergency2mobile('mobile');
      personnelEmergencyPage.enterEmergency2email('email');
      personnelEmergencyPage.enterEmergency2address('address');
      
      personnelPage.clickEditPersonnel();
      mainPage.visitPage();
      mainPersonnelPage.editPersonnel('testname');
      
      personnelEmergencyPage.visitPage();
      expect(personnelEmergencyPage.getEmergency1name()).toEqual('greg');
      expect(personnelEmergencyPage.getEmergency1relationship()).toEqual('father');
      expect(personnelEmergencyPage.getEmergency1phone()).toEqual('phone');
      expect(personnelEmergencyPage.getEmergency1mobile()).toEqual('mobile');
      expect(personnelEmergencyPage.getEmergency1email()).toEqual('email');
      expect(personnelEmergencyPage.getEmergency1address()).toEqual('address');
      expect(personnelEmergencyPage.getEmergency2name()).toEqual('greg');
      expect(personnelEmergencyPage.getEmergency2relationship()).toEqual('father');
      expect(personnelEmergencyPage.getEmergency2phone()).toEqual('phone');
      expect(personnelEmergencyPage.getEmergency2mobile()).toEqual('mobile');
      expect(personnelEmergencyPage.getEmergency2email()).toEqual('email');
      expect(personnelEmergencyPage.getEmergency2address()).toEqual('address');
      done();
    });

  });

});
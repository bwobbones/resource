var _ = require('../../../bower_components/lodash/lodash.js')

var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainJobPage = require('../../../common/test/e2e/pages/mainPage.job.js');
var JobCommentPage = require('../../../common/test/e2e/pages/jobCommentPage.js');
var JobDescriptionPage = require('../../../common/test/e2e/pages/jobDescriptionPage.js');
var JobPage = require('../../../common/test/e2e/pages/jobPage.js');
var JobQualificationsPage = require('../../../common/test/e2e/pages/jobQualificationsPage.js');
var JobRolePage = require('../../../common/test/e2e/pages/jobRolePage.js');

require('events').EventEmitter.prototype._maxListeners = 100;

describe('jobs', function() {
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

  describe('create', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var mainJobPage = new MainJobPage();
    var jobCommentPage = new JobCommentPage();
    var jobDescriptionPage = new JobDescriptionPage();
    var jobPage = new JobPage();
    var jobQualificationsPage = new JobQualificationsPage();
    var jobRolePage = new JobRolePage();
    
    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      jobPage.createJob('testcompany', 'testposition');
    });

    afterEach(function() {
      jobPage.removeJob('testcompany');
      mainPage.logout();
    });
    
   it('should create a job and find it in the search list', function(done) {
      mainJobPage.findJob('testcompany');
      expect(element.all(by.repeater('row in displayedJobs')).get(0).getText()).toContain('testcompany');
      done();
    });
    
    it('should edit a job description and update the search list', function(done) {
      jobRolePage.visitPage();
      jobRolePage.clearCompany();
      jobRolePage.enterCompany('testcompany-updated');
      jobPage.clickEditJob();
      mainJobPage.verifyJobExists('testcompany-updated');
      done();
    });
    
    it('should fill a job with data that is retrievable', function(done) {
      jobRolePage.visitPage();
      jobRolePage.enterDepartment('department');
      jobRolePage.enterPositionnumber('X1234567');
      jobRolePage.enterReportingname('bigboss');
      jobRolePage.enterReportingto('reportingto');
      jobRolePage.enterWorklocation('location');
      jobRolePage.selectWorkType('parttime');
      jobRolePage.enterDatecompleted('13/10/2015');
      jobRolePage.enterReceivedfrom('bigboss');
      jobRolePage.enterDuration('4 weeks');
      jobRolePage.enterRate('$40/hr');
      jobRolePage.enterDaterequired('13/1/2015');
      jobRolePage.toggleExpat();
      
      jobDescriptionPage.visitPage();
      jobDescriptionPage.enterDescription('hello');
      
      jobCommentPage.visitPage();
      jobCommentPage.enterComment('hello');
      
      jobPage.clickEditJob();
      mainPage.visitPage();
      mainJobPage.editJob('testcompany');
      
      jobRolePage.visitPage();
      expect(jobRolePage.getDepartment()).toEqual('department');
      expect(jobRolePage.getPositionnumber()).toEqual('X1234567');
      expect(jobRolePage.getReportingname()).toEqual('bigboss');
      expect(jobRolePage.getReportingto()).toEqual('reportingto');
      expect(jobRolePage.getWorklocation()).toEqual('location');
      expect(jobRolePage.isWorkTypeSelected('parttime')).toContain('active');
      expect(jobRolePage.isWorkTypeSelected('fulltime')).not.toContain('active');
      expect(jobRolePage.getDatecompleted()).toEqual('13/10/2015');
      expect(jobRolePage.getReceivedfrom()).toEqual('bigboss');
      expect(jobRolePage.getDuration()).toEqual('4 weeks');
      expect(jobRolePage.getRate()).toEqual('$40/hr');
      expect(jobRolePage.getDaterequired()).toEqual('13/1/2015');
      
      jobDescriptionPage.visitPage();
      expect(jobDescriptionPage.getDescription()).toEqual('hello');
      
      jobCommentPage.visitPage();
      expect(jobCommentPage.getComment()).toEqual('hello');
      
      done();
    });
    
    it('should add qualificiation requirements to a job and retrieve it', function(done) {
    
      jobQualificationsPage.visitPage();
      jobQualificationsPage.enterProjectExperience('fps');
      jobQualificationsPage.enterPhaseExperience('inst');
      
      jobPage.clickEditJob();
      mainPage.visitPage();
      mainJobPage.editJob('testcompany');
      
      jobQualificationsPage.visitPage();
      expect(jobQualificationsPage.getProjectExperience()).toContain('FPSO');
      expect(jobQualificationsPage.getProjectExperience()).not.toContain('Offshore');
      expect(jobQualificationsPage.getPhaseExperience()).toContain('Installation');
      expect(jobQualificationsPage.getPhaseExperience()).not.toContain('Procurement');
     
      done();
    });
    
    xit('should only show companies in the typeahead', function() {
      
      // add a new company
      jobPage.createJob('typeahead-company-1', 'typeahead-position-1');
      
      mainJobPage.addNewJob();
      jobRolePage.visitPage();
      jobRolePage.enterCompany('ty');
      // expect
      
      // enter the first letter of the company in the company field
      // element('a[href$="addJobDescription"]').click();
      // input('form.company').enter('ty');
      expect(jobRolePage.getCompanyTypeAheadValues()).toContain('typeahead-company-1');
      
      jobPage.removeJob('typeahead-company-1');
    });
    
  });

});
var _ = require('../../../bower_components/lodash/lodash.js')

var LoginPage = require('../../../common/test/e2e/pages/loginPage.js');
var MainPage = require('../../../common/test/e2e/pages/mainPage.js');
var MainJobPage = require('../../../common/test/e2e/pages/mainPage.job.js');
var JobCommentPage = require('../../../common/test/e2e/pages/jobCommentPage.js');
var JobDescriptionPage = require('../../../common/test/e2e/pages/jobDescriptionPage.js');
var JobPage = require('../../../common/test/e2e/pages/jobPage.js');
var JobQualificationsPage = require('../../../common/test/e2e/pages/jobQualificationsPage.js');
var JobSummaryPage = require('../../../common/test/e2e/pages/jobSummaryPage.js');
var ManageWorkflowPage = require('../../../common/test/e2e/pages/manageWorkflowPage.js');

require('events').EventEmitter.prototype._maxListeners = 100;

describe('manage workflow', function() {
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

  describe('nav', function () {
    
    var loginPage = new LoginPage();
    var mainPage = new MainPage();
    var mainJobPage = new MainJobPage();
    var jobCommentPage = new JobCommentPage();
    var jobDescriptionPage = new JobDescriptionPage();
    var jobPage = new JobPage();
    var jobQualificationsPage = new JobQualificationsPage();
    var jobSummaryPage = new JobSummaryPage();
    var manageWorkflowPage = new ManageWorkflowPage();
    
    beforeEach(function () {
      loginPage.visitPage();
      loginPage.enterCredentials('greg', 'greg');
      jobPage.createJob('testcompany', 'testposition');
    });

    afterEach(function() {
      jobPage.removeJob('testcompany');
      mainPage.logout();
    });
    
    it('should be possible to take a shortcut to a jobs applicant list', function(done) {
      mainJobPage.findJob('testcompany');
      mainJobPage.selectFirstJob();
      jobSummaryPage.clickApplicants();     
      expect(manageWorkflowPage.pageExists()).toBeTruthy();
      done();
    });
    
  });

});
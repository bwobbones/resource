var MainJobPage = require('./mainPage.job.js');
var JobRolePage = require('./jobRolePage.js');

var JobPage = (function () {
	
	var mainJobPage = new MainJobPage();
	var jobRolePage = new JobRolePage();
	
    function JobPage() {
			
		//fields
		
		// tabs
		
		// buttons
		this.addJobButton = element(by.id('addJobDescriptionButton'));
		this.editJobButton = element(by.id('editJobDescriptionButton'));
		this.deleteJobButton = element(by.id('deleteJobDescriptionButton'));
		this.deleteOkButton = element(by.id('okDeleteJobDescription'));
	};
	
	JobPage.prototype.clickAddJob = function() {
		return this.addJobButton.click();
	}
	
	JobPage.prototype.clickEditJob = function() {
		return this.editJobButton.click();
	}
	
	JobPage.prototype.clickDeleteJob = function() {
		return this.deleteJobButton.click();
	}
	
	JobPage.prototype.clickOkDelete = function() {
		return this.deleteOkButton.click();
	}
	
	// convenience methods
	JobPage.prototype.createJob = function(company, position) {
		mainJobPage.addNewJob();
		jobRolePage.visitPage();
		jobRolePage.enterCompany(company);
		jobRolePage.enterPosition(position);
		this.clickAddJob();
	}
	
	JobPage.prototype.removeJob = function(company) {
		mainJobPage.editJob(company);
		this.clickDeleteJob();
		this.clickOkDelete();
	}
	
	return JobPage;
})();

module.exports = JobPage;
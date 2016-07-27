var JobSummaryPage = require('./jobSummaryPage.js');
var MainPage = require('./mainPage.js');

var MainJobPage = (function () {
	
	var jobSummaryPage = new JobSummaryPage();
	var mainPage = new MainPage();
	
  function MainJobPage() {
		this.addJobLink = by.id('addJobLink');
		this.homeLink = by.id('homeLink');
		this.listedPersonnel = by.repeater('row in displayedPersonnel');
		this.logoutButton =  by.id('logoutButtonTop');
		this.searchText = by.model('form.searchTerms');
	};
	
	MainJobPage.prototype.addNewJob = function() {
		browser.driver.sleep(1500);
		element(this.addJobLink).click();
	}
	
	MainJobPage.prototype.searchByJob = function() {
		this.personnelSearchTypeLink = element(by.id('search-job'));
		this.personnelSearchTypeLink.click();
	}
	
	MainJobPage.prototype.findJob = function(company) {
		mainPage.visitPage();
		mainPage.enterSearchText(company);
		this.searchByJob();
	}
	
	MainJobPage.prototype.editJob = function(company) {
		this.findJob(company);
		this.selectFirstJob();
		jobSummaryPage.editJob();
	}
	
	MainJobPage.prototype.selectFirstJob = function() {
		element.all(by.repeater('row in displayedJobs')).get(0).click();
	}
	
	MainJobPage.prototype.verifyJobExists = function(company) {
		mainPage.visitPage();
		this.findJob(company);
		expect(element.all(by.repeater('row in displayedJobs')).get(0).getText()).toContain(company);
	}
	
	return MainJobPage;
})();

module.exports = MainJobPage;
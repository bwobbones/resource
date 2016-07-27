var JobSummaryPage = require('./jobSummaryPage.js');

var MainPage = (function () {
	
  function MainPage() {
		this.addPersonnelLink = by.id('addPersonnelLink');
		this.addJobLink = by.id('addJobLink');
		this.homeLink = by.id('homeLink');
		this.listedPersonnel = by.repeater('row in displayedPersonnel');
		this.logoutButton =  by.id('logoutButtonTop');
		this.searchText = by.model('form.searchTerms');
	};
	
	MainPage.prototype.visitPage = function() {
		browser.get('http://localhost:9200/');
	}
	
	MainPage.prototype.visitHome = function() {
		element(this.homeLink).click();
	}
	
	MainPage.prototype.enterSearchText = function(text) {
		element(this.searchText).sendKeys(text);
	}
	
	MainPage.prototype.logout = function() {
		element(this.logoutButton).click();
	};
	
	return MainPage;
})();

module.exports = MainPage;
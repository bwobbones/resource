var MainPage = require('./mainPage.js');
var PersonnelSummaryPage = require('./personnelSummaryPage.js');

var MainPersonnelPage = (function () {
	
	var mainPage = new MainPage();
	var personnelSummaryPage = new PersonnelSummaryPage();
	
  function MainPersonnelPage() {
		this.addPersonnelLink = by.id('addPersonnelLink');
		this.homeLink = by.id('homeLink');
		this.listedPersonnel = by.repeater('row in displayedPersonnel');
		this.logoutButton =  by.id('logoutButtonTop');
		this.searchText = by.model('form.searchTerms');
	};
	
	MainPersonnelPage.prototype.addNewPersonnel = function() {
		browser.driver.sleep(1500);
		element(this.addPersonnelLink).click();
	};
	
	MainPersonnelPage.prototype.selectPersonnel = function() {
		element.all(this.listedPersonnel).then(function(personnel) {
			personnel[0].click();
		});
	};
	
	MainPersonnelPage.prototype.searchBySurname = function() {
		this.personnelSearchTypeLink = element(by.id('search-personnelName'));
		this.personnelSearchTypeLink.click();
	}
	
	MainPersonnelPage.prototype.findPersonnel = function(surname) {
		mainPage.visitPage();
		mainPage.enterSearchText(surname);
		this.searchBySurname();
	};
	
	MainPersonnelPage.prototype.editPersonnel = function(surname) {
		this.findPersonnel(surname);
		element.all(by.repeater('row in displayedPersonnel')).get(0).click();
		personnelSummaryPage.editPersonnel();
		expect(element(by.model('form.surname')).getAttribute('value')).toEqual(surname);
	}
	
	MainPersonnelPage.prototype.verifyPersonnelExists = function(surname) {
		mainPage.visitPage();
		this.findPersonnel(surname);
		expect(element.all(by.repeater('row in displayedPersonnel')).get(0).getText()).toContain(surname);
	}
	
	return MainPersonnelPage;
})();

module.exports = MainPersonnelPage;
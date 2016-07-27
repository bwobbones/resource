var MainPersonnelPage = require('./mainPage.personnel.js');
var PersonnelPersonalPage = require('./personnelPersonalPage.js');

var PersonnelPage = (function () {
	
	var mainPersonnelPage = new MainPersonnelPage();
	var personnelPersonalPage = new PersonnelPersonalPage();
	
    function PersonnelPage() {
			
		//fields
		
		// tabs
		
		// buttons
		this.addPersonnelButton = element(by.id('addPersonnelButton'));
		this.editPersonnelButton = element(by.id('editPersonnelButton'));
		this.deletePersonnelButton = element(by.id('deletePersonnelButton'));
		this.deleteOkButton = element(by.id('okDeletePersonnel'));
		this.deleteCancelButton = element(by.id('cancelDeletePersonnel'));
	};
	
	PersonnelPage.prototype.clickAddPersonnel = function() {
		return this.addPersonnelButton.click();
	}
	
	PersonnelPage.prototype.clickEditPersonnel = function() {
		return this.editPersonnelButton.click();
	}
	
	PersonnelPage.prototype.clickDeletePersonnel = function() {
		return this.deletePersonnelButton.click();
	}
	
	PersonnelPage.prototype.clickOkDelete = function() {
		return this.deleteOkButton.click();
	}
	
	PersonnelPage.prototype.clickCancelDelete = function() {
		return this.deleteCancelButton.click();
	}
	
	// convenience methods
	PersonnelPage.prototype.createPersonnel = function(name, surname) {
		mainPersonnelPage.addNewPersonnel();
		personnelPersonalPage.visitPage();
		personnelPersonalPage.enterName(name);
		personnelPersonalPage.enterSurname(surname);
		this.clickAddPersonnel();
	}
	
	PersonnelPage.prototype.removePersonnel = function(name) {
		mainPersonnelPage.editPersonnel(name);
		this.clickDeletePersonnel();
		this.clickOkDelete();
	}
	
	return PersonnelPage;
})();

module.exports = PersonnelPage;
var _ = require('../../../../bower_components/lodash/lodash.js');

var PersonnelQualificationPage = (function () {

	var fields = [

		'qualification.name', 'qualification.dateObtained', 'qualification.expiryDate',
		'qualification.certificateNumber', 'qualification.institution', 'affiliation.name', 'affiliation.level',
		'training.name', 'training.dateObtained', 'training.expiryDate', 'training.certificateNumber',
		'training.institution'

	];

    function PersonnelQualificationPage() {

		this.qualTab = by.css('#tab_personnel_qualifications_combined a');
		this.doCancel = by.css('.btn-warning');

		this.addQualificationButton = by.css('#addQualificationButton');
		this.okQualificationDone = by.css('.okQualificationDone');
		this.listedQualification = by.repeater('qualification in form.qualifications');
		//this.deleteQualificationButtons = By.css('.deleteQualification');
		//this.deleteQualificationButton = By.css('.okDeletePersonnel');
		
		this.addAffiliationButton = by.css('#addAffiliationButton');
		this.okAffiliationDone = by.css('.okAffiliationDone');
		this.listedAffiliation = by.repeater('affiliation in form.affiliations');

		this.addTrainingButton = by.css('#addTrainingButton');
		this.okTrainingDone = by.css('.okTrainingDone');
		this.listedTraining = by.repeater('training in form.trainings');
		
		//fields
		_.each(fields, function (field) {
			var fieldSelector = by.model(field);

			var enterFunctionName = 'enter' + _.capitalize(field.replace('.', ''));
			PersonnelQualificationPage.prototype[enterFunctionName] = function (value) {
				element(fieldSelector).sendKeys(value);
			}

			var clearFunctionName = 'clear' + _.capitalize(field.replace('.', ''));
			PersonnelQualificationPage.prototype[clearFunctionName] = function () {
				element(fieldSelector).clear();
			}

			var clearThenEnterFunctionName = 'clearThenEnter' + _.capitalize(field.replace('.', ''));
			PersonnelQualificationPage.prototype[clearThenEnterFunctionName] = function (value) {
				element(fieldSelector).clear();
				element(fieldSelector).sendKeys(value);
			}

			var getFunctionName = 'get' + _.capitalize(field.replace('.', ''));
			PersonnelQualificationPage.prototype[getFunctionName] = function () {
				return element(fieldSelector).getAttribute('value');
			}
		});
	};

	function clickWhenClickable(element) {
		return browser.wait(function () {
			return element.click().then(
				function () {
					return true;
				},
				function () {
					return false;
				});
		});
	};

	PersonnelQualificationPage.prototype.visitPage = function () {
		element(this.qualTab).click();
	}

	PersonnelQualificationPage.prototype.gotoAddQualification = function () {
		clickWhenClickable(element(this.addQualificationButton));
	}
	/*
   PersonnelQualificationPage.prototype.deleteNthQualification = function(n) {
	  	   element.all(this.deleteQualificationButtons).then(function(deleteButtons) {
 			  var deleteButton = deleteButtons[n];
			  clickWhenClickable(deleteButton);
			  clickWhenClickable(element(this.deleteQualificationButton));
		   });	 

		  
	};
	*/
	PersonnelQualificationPage.prototype.selectNthQualification = function (n) {
		element.all(this.listedQualification).then(function (qualifications) {
			clickWhenClickable(qualifications[n - 1]);
		});
	};

	PersonnelQualificationPage.prototype.gotoCancelAddQualification = function () {
		clickWhenClickable(element(this.doCancel));
	}

	PersonnelQualificationPage.prototype.gotoOkQualificationDone = function () {
		clickWhenClickable(element(this.okQualificationDone));
	}
	//Affiliation
	PersonnelQualificationPage.prototype.gotoAddAffiliation = function () {
		clickWhenClickable(element(this.addAffiliationButton));
	}

	PersonnelQualificationPage.prototype.selectNthAffiliation = function (n) {
		element.all(this.listedAffiliation).then(function (affiliation) {
			clickWhenClickable(affiliation[n - 1]);
		});
	};

	PersonnelQualificationPage.prototype.gotoCancelAddAffiliation = function () {
		clickWhenClickable(element(this.doCancel));
	}

	PersonnelQualificationPage.prototype.gotoOkAffiliationDone = function () {
		clickWhenClickable(element(this.okAffiliationDone));
	}
	//Training
	
	PersonnelQualificationPage.prototype.gotoAddTraining = function () {
		clickWhenClickable(element(this.addTrainingButton));
	}

	PersonnelQualificationPage.prototype.selectNthTraining = function (n) {
		element.all(this.listedTraining).then(function (trainings) {
			clickWhenClickable(trainings[n - 1]);
		});
	};

	PersonnelQualificationPage.prototype.gotoCancelAddTraining = function () {
		clickWhenClickable(element(this.doCancel));
	}

	PersonnelQualificationPage.prototype.gotoOkTrainingDone = function () {
		clickWhenClickable(element(this.okTrainingDone));
	}

	return PersonnelQualificationPage;
})();


module.exports = PersonnelQualificationPage;

var _ = require('../../../../bower_components/lodash/lodash.js');

var PersonnelEmergencyPage = (function () {
	
	var fields = [
			'emergency1.name', 'emergency1.relationship', 'emergency1.phone', 'emergency1.mobile', 'emergency1.email', 'emergency1.address',
			'emergency2.name', 'emergency2.relationship', 'emergency2.phone', 'emergency2.mobile', 'emergency2.email', 'emergency2.address' 
		];
			
	var personnelEmergencyPage = this;
	
    function PersonnelEmergencyPage() {
			
		this.emergencyTab = by.id('tab_personnel_emergency');

		this.hcmobile = by.model('form.hcmobile');
		
		//fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field.replace('.', ''));		
			PersonnelEmergencyPage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field.replace('.', ''));
			PersonnelEmergencyPage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field.replace('.', ''));
			PersonnelEmergencyPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
	};
	
	PersonnelEmergencyPage.prototype.visitPage = function() {
		element(this.emergencyTab).click();
	}
	
	PersonnelEmergencyPage.prototype.enterHomeCountryMobile = function(mobile) {
		element(this.hcmobile).sendKeys(mobile);
	}
	
	return PersonnelEmergencyPage;
})();

module.exports = PersonnelEmergencyPage;
var _ = require('../../../../bower_components/lodash/lodash.js');

var PersonnelContactPage = (function () {
	
	  var fields = [
			'hcaddress', 'hchomephone', 'hcmobile', 'hcemail', 'nearestairport',
			'hsaddress', 'hshomephone', 'hsmobile'
		];
	
    function PersonnelContactPage() {
		
		this.contactTab = by.css('#tab_personnel_contact a');
		
		//fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			PersonnelContactPage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			PersonnelContactPage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			PersonnelContactPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
	};
		
	PersonnelContactPage.prototype.visitPage = function() {
		element(this.contactTab).click();
	}
		
	return PersonnelContactPage;
})();

module.exports = PersonnelContactPage;
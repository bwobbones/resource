var _ = require('../../../../bower_components/lodash/lodash.js');

var PersonnelPersonalPage = (function () {
	
	var fields = ['name', 'surname', 'availabledate', 'dateofbirth', 'source', 'preferredname',
			'referrer', 'project', 'noticeperiod', 'occupation', 'nationality',
			'citizenship', 'passportnumber', 'passportexpiry', 'visatype', 'visaholder', 'visastartdate',
			'visaenddate', 'summary'];
			
	var booleanFields = ['validated', 'currentlyemployed', 'rightToWork', 'holdsvisa'];
	
    function PersonnelPersonalPage() {

		this.personalTab = by.css('#tab_personnel_personal a');
		
		// fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			PersonnelPersonalPage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			PersonnelPersonalPage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			PersonnelPersonalPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
		_.each(booleanFields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var toggleFunctionName = 'toggle' + _.capitalize(field);
			PersonnelPersonalPage.prototype[toggleFunctionName] = function() {
				element(fieldSelector).click();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			PersonnelPersonalPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('checked');
			}
		});
	};
	
	PersonnelPersonalPage.prototype.visitPage = function() {
		element(this.personalTab).click();
	}
	
	return PersonnelPersonalPage;
})();

module.exports = PersonnelPersonalPage;
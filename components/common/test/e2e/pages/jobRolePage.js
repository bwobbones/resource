var _ = require('../../../../bower_components/lodash/lodash.js');

var JobRolePage = (function () {
	
	var fields = ['company', 'position', 'department', 'positionnumber', 'reportingname', 'reportingto',
		'worklocation', 'datecompleted', 'receivedfrom', 'duration', 'rate', 'daterequired'];
			
	var booleanFields = ['expat'];
	
  function JobRolePage() {

		this.detailsTab = by.id('tab_jobDescription/jobDescription_role');
		
		// fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			JobRolePage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			JobRolePage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			JobRolePage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
		_.each(booleanFields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var toggleFunctionName = 'toggle' + _.capitalize(field);
			JobRolePage.prototype[toggleFunctionName] = function() {
				element(fieldSelector).click();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			JobRolePage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('checked');
			}
		});
	};
	
	JobRolePage.prototype.visitPage = function() {
		element(this.detailsTab).click();
	}
	
	JobRolePage.prototype.selectWorkType = function(workType) {
		element(by.name(workType)).click();
	}
	
	JobRolePage.prototype.isWorkTypeSelected = function(workType) {
		return element(by.name(workType)).getAttribute('class');
	}
	
	JobRolePage.prototype.getCompanyTypeAheadValues = function() {
		// browser.pause(5001);
		element.all(by.className('dropdown-menu')).then(function(personnel) {
			return personnel.getText();
		});
		// return element(by.className('dropdown-menu')).getText();
	}
	
	return JobRolePage;
})();

module.exports = JobRolePage;
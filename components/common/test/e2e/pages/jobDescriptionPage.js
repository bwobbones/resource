var _ = require('../../../../bower_components/lodash/lodash.js');

var JobDescriptionPage = (function () {
	
	var fields = [
		'description'
	];
	
  function JobDescriptionPage() {
		
		this.descriptionTab = by.id('tab_jobDescription/jobDescription_description');
		
		//fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			JobDescriptionPage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			JobDescriptionPage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			JobDescriptionPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
	};
		
	JobDescriptionPage.prototype.visitPage = function() {
		element(this.descriptionTab).click();
	}
		
	return JobDescriptionPage;
})();

module.exports = JobDescriptionPage;
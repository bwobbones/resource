var _ = require('../../../../bower_components/lodash/lodash.js');

var JobCommentPage = (function () {
	
	var fields = [
		'comment'
	];
	
  function JobCommentPage() {
		
		this.commentTab = by.id('tab_jobDescription/jobDescription_comments');
		
		//fields
		_.each(fields, function(field) {
			var fieldSelector = by.model('form.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			JobCommentPage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			JobCommentPage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			JobCommentPage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
			
		});
		
	};
		
	JobCommentPage.prototype.visitPage = function() {
		element(this.commentTab).click();
	}
		
	return JobCommentPage;
})();

module.exports = JobCommentPage;
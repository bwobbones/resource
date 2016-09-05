var _ = require('../../../../bower_components/lodash/lodash.js');

var PersonnelRolePage = (function () {

	var fields = [
		'roleName', 'client', 'startDate', 'endDate', 'newProject',
		'responsibilities'
	];

	var buttons = [
		'addRoleButton', 'addProjectButton', 'editProjectButton', 
		'saveAndNewButton', 'okRolesDone', 'cancelAddRole'
	];
	
    function PersonnelRolePage() {
		this.roleTab = by.css('#tab_personnel_roles a');

		_.each(fields, function(field) {
			var fieldSelector = by.model('role.' + field);
			
			var enterFunctionName = 'enter' + _.capitalize(field);		
			PersonnelRolePage.prototype[enterFunctionName] = function(value) {
				element(fieldSelector).sendKeys(value);
			}
			
			var clearFunctionName = 'clear' + _.capitalize(field);
			PersonnelRolePage.prototype[clearFunctionName] = function() {
				element(fieldSelector).clear();
			}
			
			var getFunctionName = 'get' + _.capitalize(field);
			PersonnelRolePage.prototype[getFunctionName] = function() {
				return element(fieldSelector).getAttribute('value');
			}
		});

		_.each(buttons, function(button) {
			var buttonSelector = by.id(button);
			
			var clickFunctionName = 'click' + _.capitalize(button);		
			PersonnelRolePage.prototype[clickFunctionName] = function() {
				element(buttonSelector).click();
			}
		});
	};

	PersonnelRolePage.prototype.visitPage = function() {
		element(this.roleTab).click();
	}

	PersonnelRolePage.prototype.enterProjectLocation = function(value) {
		element(by.model('project.location.name')).sendKeys(value);
	}

	PersonnelRolePage.prototype.clearProjectLocation = function() {
		element(by.model('project.location.name')).clear();
	}

	PersonnelRolePage.prototype.getProjectLocation = function() {
		element(by.model('project.location.name')).getAttribute('value');
	}
		
	return PersonnelRolePage;
})();

module.exports = PersonnelRolePage;
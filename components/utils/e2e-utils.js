/* global input, jQueryFunction */

// this extends the e2e dsl to enable the direct use of jquery functions
// @see http://stackoverflow.com/questions/15750966/e2e-testing-with-angular-ui-datepicker
angular.scenario.dsl('jQueryFunction', function() {
  return function(selector, functionName /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    return this.addFutureAction(functionName, function($window, $document, done) {
      var $ = $window.$; // jQuery inside the iframe
      var elem = $(selector);
      if (!elem.length) {
          return done('Selector ' + selector + ' did not match any elements.');
      }
      done(null, elem[functionName].apply(elem, args));
    });
  };
});

angular.scenario.dsl('appElement', function() {
  return function(selector, fn) {
    return this.addFutureAction('element ' + selector, function($window, $document, done) {
      fn.call(this, $window.angular.element(selector));
      done();
    });
  };
});

// common business functions
function login() {
  input('form.username').enter('greg');
  input('form.password').enter('greg');
  element('#loginButton').click();
}

function logout() {
  // if ($('#profileToggle')) {
    element('#profileToggle').click();
    element('#logoutButton').click();
  // }
}

function createPersonnel(name, surname) {
  element('a[href$="addPersonnel"]').click();
  input('form.name').enter(name);
  input('form.surname').enter(surname);
  element('#addPersonnelButton').click();
  expect(element('.personnelList').text()).toContain(name);
}

function deletePersonnel(name) {
  element('a[href$="addPersonnel"]').click();
  element("*:contains(" + name + ")").click();
  element('#deletePersonnelButton').click();
  element('.okDeletePersonnel').click();
}

function addRole(name) {
  element('#addRoleButton').click();
  input('role.roleName').enter(name);
  element('.okRolesDone').click();
  expect(element('#roleName-' + name + ':visible').text()).toContain(name);
}

function addQualification(name, withExpiry) {
  element('#addQualificationButton').click();
  input('qualification.name').enter(name);
  if (withExpiry) {
    input('qualification.expiryDate').enter('20/10/2015')
  }
  element('.okQualificationDone').click();
  expect(element('#qualificationName-' + name + ':visible').text()).toContain(name);
}

function selectDate(dateFieldId) {
  element(dateFieldId).click();
  element('span.text-info').click();
}

function addAffiliation(name, level) {
  element('#addAffiliationButton').click();
  input('affiliation.name').enter(name);
  input('affiliation.level').enter(level);
  element('.okAffiliationDone').click();
  expect(element('#affiliationName-' + name + ':visible').text()).toContain(name);
}

function addTraining(name, withDate) {
  element('#addTrainingButton').click();
  input('training.name').enter(name);
  if (withDate) {
    selectDate('#dateObtainedPicker');
  }
  element('.okTrainingDone').click();
  expect(element('#trainingName-' + name + ':visible').text()).toContain(name);
}

function addCommLog(personnelName, message) {
  element('*:contains("' + personnelName + '")').click();
  element('#addCommLogButton').click();
  element("[name='commLog.typeEmail']").click();
  element("[name='commLog.directionIngoing']").click();
  input('commLog.message').enter(message || 'a basic message');
  element('.okCommLogDone:visible').click();
}

function createJobDescription(companyName, positionName) {
  element('a[href$="addJobDescription"]').click();
  input('form.company').enter(companyName);
  input('form.position').enter(positionName);
  input('form.similarPosition').enter(positionName);
  element('#addJobDescriptionButton').click();
  expect(element('.jobDescriptionList').text()).toContain(positionName);
}

function deleteJobDescription(name) {
  element("*:contains(" + name + ")").click();
  element('#deleteJobDescriptionButton').click();
  element('.okDeleteJobDescription').click();
}
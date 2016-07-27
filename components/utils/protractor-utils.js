/* global input */
var fs = require('fs');

/*
Usage:

var utils = require('../../../utils/protractor-utils.js');
var input = utils.input;
var login = utils.login;
var logout = utils.logout;
var createPersonnel = utils.createPersonnel;
var deletePersonnel = utils.deletePersonnel;
var addRole = utils.addRole;
var addQualification = utils.addQualification;
var selectDate = utils.selectDate;
var addAffiliation = utils.addAffiliation;
var addTraining = utils.addTraining;
var addCommLog = utils.addCommLog;
var createJobDescription = utils.createJobDescription;
var deleteJobDescription = utils.deleteJobDescription;


*/

var exports = module.exports = {};

function input(selector) {
  var elem = element(by.model(selector));
  elem.enter = elem.sendKeys;
  return elem;
}

exports.input = input;

// screen shots
exports.takeScreenshot = function(fileName) {
  browser.takeScreenshot().then(function (png) {
    utils.writeScreenShot(png, fileName);
  });
}

exports.writeScreenShot = function(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

// common business functions
exports.login = function login() {
  element(by.model('form.username')).clear();
  element(by.model('form.password')).clear();
  element(by.model('form.username')).sendKeys('greg');
  element(by.model('form.password')).sendKeys('greg');
  element(by.id('loginButton')).click();
}

exports.logout = function logout() {
  element(by.id('logoutButtonTop')).click();
}

exports.createPersonnel = function createPersonnel(name, surname) {
  //element('//a[contains(@href, "addPersonnel")]').click();
  element(by.id('addPersonnelLink')).click();
  element(by.model('form.name')).sendKeys(name);
  element(by.model('form.surname')).sendKeys(surname);
  element(by.id('addPersonnelButton')).click();

  expect(element.all(by.css('.personnelList')).getText()).toContain(surname + ', ' + name);
}

exports.deletePersonnel = function deletePersonnel(name) {
  element(by.id('addPersonnelLink')).click();
  element(by.xpath("//*[contains(text(), '" + name + "')]")).click();
  element(by.id('deletePersonnelButton')).click();
  element(by.css('.okDeletePersonnel')).click();
}

exports.addRole = function addRole(name) {
  element('#addRoleButton').click();
  input('role.roleName').enter(name);
  element('.okRolesDone').click();
  expect(element('#roleName-' + name + ':visible').text()).toContain(name);
}

exports.addQualification = function addQualification(name, withExpiry) {
  element('#addQualificationButton').click();
  input('qualification.name').enter(name);
  if (withExpiry) {
    input('qualification.expiryDate').enter('20/10/2015')
  }
  element('.okQualificationDone').click();
  expect(element('#qualificationName-' + name + ':visible').text()).toContain(name);
}

exports.selectDate = function selectDate(dateFieldId) {
  element(dateFieldId).click();
  element('span.text-info').click();
}

exports.addAffiliation = function addAffiliation(name, level) {
  element('#addAffiliationButton').click();
  input('affiliation.name').enter(name);
  input('affiliation.level').enter(level);
  element('.okAffiliationDone').click();
  expect(element('#affiliationName-' + name + ':visible').text()).toContain(name);
}

exports.addTraining = function addTraining(name, withDate) {
  element('#addTrainingButton').click();
  input('training.name').enter(name);
  if (withDate) {
    selectDate('#dateObtainedPicker');
  }
  element('.okTrainingDone').click();
  expect(element('#trainingName-' + name + ':visible').text()).toContain(name);
}

exports.addCommLog = function addCommLog(personnelName, message) {
  element(by.xpath("//*[contains(text(), '" + personnelName + "')]")).click();
  element('#addCommLogButton').click();
  element("[name='commLog.typeEmail']").click();
  element("[name='commLog.directionIngoing']").click();
  input('commLog.message').enter(message || 'a basic message');
  element('.okCommLogDone:visible').click();
}

exports.createJobDescription = function createJobDescription(companyName, positionName) {
  element('a[href$="addJobDescription"]').click();
  input('form.company').enter(companyName);
  input('form.position').enter(positionName);
  input('form.similarPosition').enter(positionName);
  element('#addJobDescriptionButton').click();
  expect(element('.jobDescriptionList').text()).toContain(positionName);
}

exports.deleteJobDescription = function deleteJobDescription(name) {
  element(by.xpath("//*[contains(text(), '" + personnelName + "')]")).click();
  element('#deleteJobDescriptionButton').click();
  element('.okDeleteJobDescription').click();
}
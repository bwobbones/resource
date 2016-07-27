var JobQualificationsPage = (function () {
  
  function JobQualificationsPage() {
    this.projectExperienceField = by.model('form.projectExperience');
    this.projectExperienceSelection = by.id('jobProjectExperience');
    this.phaseExperienceField = by.model('form.phaseExperience');
    this.phaseExperienceSelection = by.id('jobPhaseExperience');
    this.qualificationsTab = by.id('tab_jobDescription/jobDescription_qualifications');
  }

  JobQualificationsPage.prototype.visitPage = function () {
    element(this.qualificationsTab).click();
  };

  JobQualificationsPage.prototype.enterProjectExperience = function(project) {
    element(this.projectExperienceField).sendKeys(project);
  };
  
  JobQualificationsPage.prototype.getProjectExperience = function() {
    return element(this.projectExperienceSelection).$('option:checked').getText();
    // return element(this.projectExperienceSelection).getText();
  }
  
  JobQualificationsPage.prototype.enterPhaseExperience = function(phase) {
    element(this.phaseExperienceField).sendKeys(phase);
  };
  
  JobQualificationsPage.prototype.getPhaseExperience = function() {
    return element(this.phaseExperienceSelection).$('option:checked').getText();
    // return element(this.phaseExperienceSelection).getText();
  }

  return JobQualificationsPage;

})();

module.exports = JobQualificationsPage; 
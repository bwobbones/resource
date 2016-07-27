var JobSummaryPage = (function () {
	
  function JobSummaryPage() {
		this.sliderEditJobButton = by.id('sliderEditJob');
		this.applicantLink = by.id('applicantLink');
	};
	
	JobSummaryPage.prototype.editJob = function() {
		element(this.sliderEditJobButton).click();
	}
	
	JobSummaryPage.prototype.clickApplicants = function() {
		element(this.applicantLink).click();
	}
	
	return JobSummaryPage;
})();

module.exports = JobSummaryPage;
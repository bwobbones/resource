var PersonnelSummaryPage = (function () {
	
    function PersonnelSummaryPage() {
		this.sliderEditPersonnelButton = by.id('sliderEditPersonnel');
	};
	
	PersonnelSummaryPage.prototype.editPersonnel = function() {
		element(this.sliderEditPersonnelButton).click();
	}
	
	return PersonnelSummaryPage;
})();

module.exports = PersonnelSummaryPage;
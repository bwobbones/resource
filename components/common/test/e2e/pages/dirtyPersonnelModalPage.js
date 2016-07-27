var DirtyPersonnelModalPage = (function () {
	
  function DirtyPersonnelModalPage() {
		// buttons
		this.okButton = element(by.id('okDirtyPersonnel'));
		this.cancelButton = element(by.id('cancelDirtyPersonnel'));
	};
	
	DirtyPersonnelModalPage.prototype.clickOk = function() {
		this.okButton.click();
	}
	
	DirtyPersonnelModalPage.prototype.clickCancel = function() {
		this.cancelButton.click();
	}
	
	return DirtyPersonnelModalPage;
})();

module.exports = DirtyPersonnelModalPage;
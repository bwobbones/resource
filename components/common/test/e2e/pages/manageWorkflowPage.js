var ManageWorkflowPage = (function () {
	
  function ManageWorkflowPage() {
		this.workflowTable = by.id('workflowTable');
	};
	
	ManageWorkflowPage.prototype.pageExists = function() {
		return element(this.workflowTable).isPresent();
	}
	
	return ManageWorkflowPage;
})();

module.exports = ManageWorkflowPage;
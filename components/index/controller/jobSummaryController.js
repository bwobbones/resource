angularModules.controller('JobSummaryCtrl', ['$aside', '$modalInstance', '$scope', '$state', 'selectedJob', 'TabService', JobSummaryCtrl]);

function JobSummaryCtrl($aside, $modalInstance, $scope, $state, selectedJob, TabService) {
  
  $scope.selectedJob = selectedJob;
  
  $scope.clearSelected = function() {
    $modalInstance.dismiss('cancel');
    $scope.selectedJob = undefined;
  }

  $scope.editSelected = function() {
    $modalInstance.dismiss('cancel');
    $state.go('jobDescription.editJobDescription', {
      id: selectedJob._id
    });
  }
  
  $scope.openWorkflow = function() {
    TabService.setRemembered('jobTabs', 'Applicants');
    $modalInstance.dismiss('cancel');
    $state.go('jobDescription.editJobDescription', {
      id: selectedJob._id
    });
  }

}

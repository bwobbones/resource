'use strict';

/* exported JobDescriptionMissingMandatoryCtrl */

angularModules.controller('JobDescriptionMissingMandatoryCtrl', ['$scope', '$modalInstance', '$state',
  'JobDescriptionService', 'jobDescriptionData', 'pForm', JobDescriptionMissingMandatoryCtrl]);

function JobDescriptionMissingMandatoryCtrl($scope, $modalInstance, $state, JobDescriptionService,
  jobDescriptionData, pForm) {
  
  $scope.form = jobDescriptionData;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.saveMandatoryJobDescription = function() {
    JobDescriptionService.save($scope.form, pForm).then(function(httpResult) {
      $modalInstance.close(httpResult);
      $state.transitionTo('jobDescription.editJobDescription', {
        id : httpResult.data._id
      });
    });
  };
  
}
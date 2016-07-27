/* globals appServices */
'use strict';

appServices.factory('ManageWorkflowService', function($http, $q, RoleService) {
  var manageWorkflowService = {
   
  	load: function(jobDescriptionId) {
      var promise = $http.get('/api/manageWorkflow/' + jobDescriptionId).success(function(httpResult) {
        return httpResult;
      });
      return promise;
  	},
    
    refresh: function(scope) {
      var promise = this.load(scope.parentJobDescriptionId).then(function(httpResult) {
        mergeJobDescriptionAndPersonnels(scope, httpResult);
        scope.jobDescription = httpResult.data.jobDescription;
        manageWorkflowService.initialisePersonnel(scope);
      });
      return promise;      
    },
    
    initialisePersonnel: function(scope) {
      _.each(scope.mergedPersonnels, function (personnel) {
        personnel.currentRole = RoleService.latestRole(personnel);
        if (personnel.acceptable === undefined) {
          personnel.acceptable = true;
        }
        if (!personnel.currentWorkflow) {
          personnel.currentWorkflow = 0;
        }
      });
    }

  };
  
  function mergeJobDescriptionAndPersonnels(scope, httpResult) {
    scope.jobDescriptionPersonnels = httpResult.data.jobDescription.personnels;
    scope.mergedPersonnels = [];
    _.each(scope.jobDescriptionPersonnels, function(jobDescriptionPersonnel, index) {
      scope.mergedPersonnels.push(
        _.merge(jobDescriptionPersonnel, httpResult.data.personnelData[index])
      );
    });
  }
  
  return manageWorkflowService;
});


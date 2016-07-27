angularModules.controller('AffiliationCtrl', ['$scope', '$modalInstance', 'AlertService', 'PersonnelService',
  'personnelData', 'entity', 'pForm', AffiliationCtrl]);

function AffiliationCtrl($scope, $modalInstance, AlertService, PersonnelService, personnelData, entity, pForm) {
  
  $scope.personnelName = personnelData.name ? personnelData.name : "";
  $scope.affiliations = personnelData.affiliations;
  $scope.affiliation = entity;

  $scope.dateOptions = {
    dateFormat: 'd/m/yy'
  };
  
  $scope.cancel = function() {
    $modalInstance.close(1);
  };

  $scope.ok = function () {
    saveAffiliation();
    $modalInstance.close(1);
  };

  $scope.saveAndNew = function() {
    saveAffiliation();
    $scope.affiliation = {};
  };

  function saveAffiliation() {
    $scope.affiliation._id = $scope.affiliation._id || new ObjectId();
    personnelData.affiliations = personnelData.affiliations || [];

    if (findAffilByAffilId($scope.affiliation._id) !== undefined) {
      updateAffiliations($scope.affiliation._id);
    }
    personnelData.affiliations.push($scope.affiliation);
    PersonnelService.save($scope, personnelData, pForm);
    AlertService.add("success", "Affiliation " + $scope.affiliation.name + " added");
  }

  function findAffilByAffilId(qualId) {
    return _.find(personnelData.affiliations, function(affiliation){ return affiliation._id === qualId; });
  }

  function updateAffiliations(affiliationId) {
    var oldAffiliations = personnelData.affiliations;
    personnelData.affiliations = [];
    _.each(oldAffiliations, function(affiliation) {
      if (affiliation._id != affiliationId) personnelData.affiliations.push(affiliation);
    });
  }

}


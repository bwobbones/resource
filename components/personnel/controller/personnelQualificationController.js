angularModules.controller('PersonnelQualificationCtrl', ['$scope', 'SliderService', '$modal', '_', 'hotkeys',
  PersonnelQualificationCtrl]);

function PersonnelQualificationCtrl($scope, SliderService, $modal, _, hotkeys) {
  
var Qual_Type = {
    Qualification : {value: "Qualification",
                     templateUrl: "partials/qualification/editQualifications",
                     controller : "QualificationCtrl",
                     deleteUrl: "partials/qualification/deleteQualification",
                     deleteController: "DeleteQualificationCtrl"},
       Affiliation: {value: "Affiliation",
                    templateUrl: "partials/affiliation/editAffiliations",
                    controller : "AffiliationCtrl",
                    deleteUrl: "partials/affiliation/deleteAffiliation",
                    deleteController: "DeleteAffiliationCtrl"},
          Training: {value: "Training",
                    templateUrl: "partials/training/editTrainings",
                    controller : "TrainingCtrl",
                    deleteUrl: "partials/training/deleteTraining",
                    deleteController: "DeleteTrainingCtrl"},
  };
  
  function setScopeVar(object) {
    if (object === Qual_Type.Qualification) {
      object.scopeVar = $scope.form.qualifications;
    } else  if (object  === Qual_Type.Affiliation) {
      object.scopeVar = $scope.form.affiliations;
    } else  if (object === Qual_Type.Training) {
      object.scopeVar = $scope.form.trainings;
    } 
  }
  
  // Qualifications 
  $scope.addQualification = function() {
     updateEntity(Qual_Type.Qualification);
  };
  
  $scope.editQualification = function(qualificationId) {
     updateEntity(Qual_Type.Qualification, findEntityByEntityId(Qual_Type.Qualification, qualificationId));
  };
  
  $scope.openDeleteQualificationMessageBox = function(qualificationId) {
     openDeleteMessageBox(Qual_Type.Qualification, findEntityByEntityId(Qual_Type.Qualification, qualificationId))
  }; 
   
  // Affiliations
  $scope.addAffiliation = function() {
     updateEntity(Qual_Type.Affiliation);
  };
  
  $scope.editAffiliation = function(affiliationId) {
     updateEntity(Qual_Type.Affiliation, findEntityByEntityId(Qual_Type.Affiliation, affiliationId));
  };
  
  $scope.openDeleteAffiliationMessageBox = function(affiliationId) {
     openDeleteMessageBox(Qual_Type.Affiliation, findEntityByEntityId(Qual_Type.Affiliation, affiliationId))
  };  
  
  // Training
  $scope.addTraining = function() {
     updateEntity(Qual_Type.Training);
  };
  
  $scope.editTraining = function(trainingId) {
     updateEntity(Qual_Type.Training, findEntityByEntityId(Qual_Type.Training, trainingId));
  };
  
  $scope.openDeleteTrainingMessageBox = function(trainingId) {
     openDeleteMessageBox(Qual_Type.Training, findEntityByEntityId(Qual_Type.Training, trainingId))
  }; 
  
  $scope.hasQualifications = function() {
    return $scope.hasEntities(Qual_Type.Qualification);
  };
 
  $scope.hasAffiliations = function() {
    return $scope.hasEntities(Qual_Type.Affiliation);
  };

  $scope.hasTrainings = function() {
    return $scope.hasEntities(Qual_Type.Training);
  }
  
  function updateEntity(entityType, entity) {
    setScopeVar(entityType);
    $scope.pForm.entities = [];
    entity= (entity) ? entity : {};

    SliderService.openSlider(
      entityType.controller,
      entityType.templateUrl,
       {
        personnelData : function() {
          return $scope.form;
        },
        entity: function() {
          return entity;
        },
        pForm: function() {
          return $scope.pForm;
        }
      }
    );

  };
  
  function openDeleteMessageBox(entityType, entity) {
      entity= (entity) ? entity : {};
      setScopeVar(entityType);

    SliderService.openSlider(
      entityType.deleteController,
      entityType.deleteUrl,
      {
       personnelData : function() {
            return $scope.form;
          },
          entity: function() {
            return entity;
          }
      }, 'sm'
    );
   };
  
  function findEntityByEntityId(entityType, entityId) {
    setScopeVar(entityType);
    return _.find(entityType.scopeVar, function(entity){ return entity._id === entityId; });
  }
  
  $scope.hasEntities = function(entityType) {
    setScopeVar(entityType);
    return $scope.form !== undefined && entityType.scopeVar !== undefined && !allEntitiesDeleted(entityType);
  };
  
  function allEntitiesDeleted(entityType) {
    setScopeVar(entityType);

    var allDeleted = true;

    _.each(entityType.scopeVar, function(entity) {
      if (!entity.deleted) {
        allDeleted = false;
      }
    });
    
    return allDeleted;
  }
      
  function postClose() {
    $scope.asideState.open = false;
  }
      
  function openAside() {
     $scope.asideState = {
        open: true,
        position: 'right'
     };
  }

  hotkeys.add({ combo: 'q', description: 'Add a new qualification', 
    callback: function() {
      if ($scope.pForm.$valid) {
        $scope.addQualification();
      }
    }
  });
  
   hotkeys.add({ combo: 'a', description: 'Add a new affiliation', 
    callback: function() {
      if ($scope.pForm.$valid) {
        $scope.addAffiliation();
      }
    }
  });
 
}
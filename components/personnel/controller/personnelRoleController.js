angularModules.controller('PersonnelRoleCtrl', ['$scope', '$aside', '$filter', '_',
  'hotkeys', PersonnelRoleCtrl]);

function PersonnelRoleCtrl($scope, $aside, $filter, _, hotkeys) {

  $scope.sortByRoleEnd = function(role) {
    if (!role.endDate) {
      sortDate = "01/01/2200";
    } else {
      sortDate = role.endDate;
    }
    return moment(sortDate, ['D/M/YYYY', 'MMM YYYY', 'MMMM YYYY'], true).valueOf();
  };

  
  $scope.updateRole = function(roleId) {
    $scope.pForm.roles = [];
    var role= (roleId) ? findRoleByRoleId(roleId) : {};
    
    $scope.asideState = {
      open: true,
      position: 'right'
    };
    
    function postClose() {
      $scope.asideState.open = false;
    }
    
    
   $aside.open({
      scope:$scope,
      templateUrl : 'partials/role/editRoles',
      placement: 'right',
      controller : 'RoleCtrl',
      size : 'lg',
      backdrop: true,
      backdropClass: 'bg-info',
      resolve : {
        personnelData : function() {
          return $scope.form;
        },
        roleData: function() {
          return role;
        },
        pForm: function() {
          return $scope.pForm;
        }
      }
    }).result.then(postClose, postClose);
  };

  $scope.openDeleteRoleMessageBox = function(roleId, roleName) {
      $scope.asideState = {
      open: true,
      position: 'right'
    };
    
    function postClose() {
      $scope.asideState.open = false;
    }
    
    
    $aside.open({
         scope:$scope,
      templateUrl : 'partials/role/deleteRole',
          placement: 'right',
      controller : 'DeleteRoleCtrl',
          size : 'sm',
      resolve : {
        role : function() {
          return findRoleByRoleId(roleId);
        },
        personnelData : function() {
          return $scope.form;
        },
      }
    }).result.then(postClose, postClose);
  };


 

  function findRoleByRoleId(roleId) {
    return _.find($scope.form.roles, function(role){ return role._id === roleId; });
  }

  $scope.hasRoles = function() {
    return $scope.form !== undefined && $scope.form.roles !== undefined && !allRolesDeleted();
  };

  function allRolesDeleted() {

    var allDeleted = true;

    _.each($scope.form.roles, function(role) {
      if (!role.deleted) {
        allDeleted = false;
      }
    });
    
    return allDeleted;
  }

  // project mappings
  $scope.projectMappings = {
    offOG: {
      abbreviation: 'OFF',
      fullName: 'Offshore Oil & Gas'
    },
    onOG: {
      abbreviation: 'ON',
      fullName: 'Onshore Oil & Gas'
    },
    fpso: {
      abbreviation: 'FPSO',
      fullName: 'FPSO'
    },
    lng: {
      abbreviation: 'LNG',
      fullName: 'LNG'
    },
    eeha: {
      abbreviation: 'EEHA',
      fullName: 'EEHA'
    },
    rpn: {
      abbreviation: 'RPN',
      fullName: 'Refinery/Petrochem/Nuclear'
    },
    other: {
      abbreviation: 'OTH',
      fullName: 'Other'
    }
  };

  $scope.phaseMappings = {
    administration: {
      abbreviation: 'ADM',
      fullName: 'Administration'
    },
    engineering: {
      abbreviation: 'ENG',
      fullName: 'Engineering'
    },
    procurement: {
      abbreviation: 'PRO',
      fullName: 'Procurement'
    },
    construction: {
      abbreviation: 'CON',
      fullName: 'Construction'
    },
    installation: {
      abbreviation: 'INS',
      fullName: 'Installation'
    },
    commissioning: {
      abbreviation: 'COM',
      fullName: 'Commissioning'
    },
    opsmaint: {
      abbreviation: 'OPS',
      fullName: 'Operations & Maintenance'
    },
    decommissioning: {
      abbreviation: 'DEC',
      fullName: 'Decommissioning'
    },
    shutdown: {
      abbreviation: 'SHD',
      fullName: 'Shutdown'
    }
  };

  hotkeys.add({ combo: 'r', description: 'Add a new role', 
    callback: function() {
      if ($scope.pForm.$valid) {
        $scope.addRole();
      }
    }
  });
}
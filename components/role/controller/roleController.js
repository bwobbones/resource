angularModules.controller('RoleCtrl', RoleCtrl);

function RoleCtrl($scope, $modalInstance, $http, $q, $filter, AlertService, DateValidationService, GoogleLocationService,
  TypeAheadService, PersonnelService, personnelData, roleData, pForm, _) {

  $scope.personnelName = personnelData.name || "";
  $scope.roles = personnelData.roles;

  $scope.role = roleData;

  $scope.collapseResponsibilities = true;

  $scope.showLocationOptions = false;
  $scope.role.useGoogle = true;

  $scope.addProject = function() {

    if (!$scope.role.projects) {
      $scope.role.projects = [];
    }

    var newProject = {
      id: $scope.role.newProject,
      text: $scope.role.newProject
    };

    $scope.role.projects.push(newProject);

    $scope.role.newProject = "";
  };

  $scope.editProject = function() {
    $scope.collapseProjectEditable = !$scope.collapseProjectEditable;
    if (!$scope.collapseProjectEditable) {
      $scope.editProjectName = "Edit";
    } else {
      $scope.editProjectName = "End Edit";
    }
  };

  $scope.cancel = function() {
    $modalInstance.close(1);
  };

  $scope.ok = function () {
    if ($scope.roleForm.$valid) {
      saveRole();
      $modalInstance.close(1);
    }
  };

  $scope.saveAndNew = function() {
    if ($scope.roleForm.$valid) {
      saveRole();
      $scope.role = {};
    }
  };

  function saveRole() {
    $scope.role._id = $scope.role._id || new ObjectId();
    personnelData.roles = personnelData.roles || [];

    if (findRoleByRoleId($scope.role._id) !== undefined) {
      updateRoles($scope.role._id);
    }
    $scope.role.startDate = $filter('date')($scope.role.startDate, 'd/M/yyyy');
    $scope.role.endDate = $filter('date')($scope.role.endDate, 'd/M/yyyy');
    $scope.role.yearsPerformed = $scope.calculateYearsPerformed($scope.role);
    personnelData.roles.push($scope.role);
    PersonnelService.save($scope, personnelData, pForm);
    AlertService.add("success", "Role " + $scope.role.roleName + " added");
  }

  function findRoleByRoleId(roleId) {
    return _.find(personnelData.roles, function(role){ return role._id === roleId; });
  }

  function updateRoles(roleId) {
    var oldRoles = personnelData.roles;
    personnelData.roles = [];
    _.each(oldRoles, function(role) {
      if (role._id != roleId) personnelData.roles.push(role);
    });
  }

  $scope.calculateYearsPerformed = function(role) {

    var end = moment(role.endDate, ['D/M/YYYY', 'MMM YYYY', 'MMMM YYYY'], true);
    var start = moment(role.startDate, ['D/M/YYYY', 'MMM YYYY', 'MMMM YYYY'], true);

    if (!start.isValid() && !end.isValid()) {
      return "";
    }

    if (!end.isValid()) {
      return start.format("D/M/YYYY") + " to current";
    }

    if (!start.isValid()) {
      return "until " + end.format("D/M/YYYY");
    }

    return moment.duration(end.diff(start)).humanize();
  };

  $scope.typeAhead = function(field, value) {
    return TypeAheadService.query(field, value);
  };

  $scope.getLocation = function(value) {

    var locationSources = [];
    locationSources.push($http.get('/api/typeAheadFieldData', {params: {fieldName: 'location', searchKey: value}}));
    locationSources.push(GoogleLocationService.query(value));

    return $q.all(locationSources).then(function (results) {
        var locations = [];
        _.each(results, function (result) {
          if (result && result.data.typeAheadData) {
            _.each(result.data.typeAheadData, function(httpResult){
              locations.push({
                name: httpResult.location.name
              });
            });            
          }
          if (result && result.data.results) {
            _.each(result.data.results, function(item) {
              locations.push({
                  name: item.formatted_address,
                  position: item.geometry.location
                });
            }); 
          }           
        });
        return locations;
      });
  };

  $scope.updateLocation = function(location, projectIndex) {
    var project = $scope.role.projects[projectIndex];
    if (!location.position) {
      project.location = location;
      project.googleLocation = undefined;
    } else {
      project.googleLocation = location;
      project.location = undefined;
    }
    project.position = location.position;
  };

  $scope.removeTab = function(index) {
    $scope.role.projects.splice(index, 1);
  };

}


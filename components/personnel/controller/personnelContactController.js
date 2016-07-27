angularModules.controller('PersonnelContactCtrl', ['$scope', '$timeout', PersonnelContactCtrl]);

function PersonnelContactCtrl($scope, $timeout) {

  if ($scope.form) {
    $scope.homeMap = centerOnLocation($scope.form.homeLocation);
    $scope.hostMap = centerOnLocation($scope.form.hostLocation);
    $scope.$watch('tabPane.active', function() {
      $timeout(function() {
        triggerResize($scope.homeMap);
        triggerResize($scope.hostMap);
      });
    });
  }

  function triggerResize(location) {
    if (location.control.getGMap) {
      google.maps.event.trigger(location.control.getGMap(), "resize");
    }
  }

  function centerOnLocation(location) {
    var centeredLoc = {
      control: {},
      center: {
        latitude: location ? location.lat : 0,
        longitude: location ? location.lng : 0
      },
      zoom: 15
    };

    centeredLoc.refresh = function(origCenter) {
      centeredLoc.control.refresh(origCenter);
    };

    return centeredLoc;
  }

  $scope.updateHomeAddress = function(address) {
    $scope.form.homeLocation = address.location;
    $scope.homeMap.center = {
      latitude: $scope.form.homeLocation.lat,
      longitude: $scope.form.homeLocation.lng
    };
  };

  $scope.updateHostAddress = function(address) {
    $scope.form.hostLocation = address.location;
    $scope.hostMap.center = {
      latitude: $scope.form.hostLocation.lat,
      longitude: $scope.form.hostLocation.lng
    };
  };


}

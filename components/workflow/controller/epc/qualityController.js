angularModules.controller('QualityCtrl', ['$scope', '$window', QualityCtrl]);

function QualityCtrl($scope, $window) {

  $scope.personnelWorkflow.piRequestPortal = 'https://accesspi.piwebservices.com/Default.aspx?ReturnUrl=%2fHome.aspx';

  $scope.openPIPortal = function() {
  	$window.open($scope.personnelWorkflow.piRequestPortal);
  };

}
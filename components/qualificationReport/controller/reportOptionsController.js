angularModules.controller('ReportOptionsCtrl', ['$scope', '$rootScope', ReportOptionsCtrl]);

function ReportOptionsCtrl($scope, $rootScope) {

	$scope.$watch('form.onlyExpired', function(newValue, oldValue) {
      if (newValue != oldValue) {
        $rootScope.$emit('onlyExpiredChanged', newValue);
      }
    });

}
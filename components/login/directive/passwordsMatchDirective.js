minhrDirectives.directive('passwordsMatch', function($http, $rootScope) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      
        function validate(value) {

          if(!scope.user && !scope.user.password && !scope.confirmpassword) {
            ngModel.$setValidity('mismatch', true);
          } else if (scope.user.password === scope.confirmpassword) {
            ngModel.$setValidity('mismatch', true);
          } else {
            ngModel.$setValidity('mismatch', false);
          }
        }
        
        scope.$watch( function() {
          return ngModel.$viewValue;
        }, validate);
        

    }
  };
});
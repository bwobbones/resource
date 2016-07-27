minhrDirectives.directive('dateTimeValidation', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (moment(viewValue, 'DD/MM/YYYY HH:mm', true).isValid()) {
          ctrl.$setValidity('dateTimeValidation', true);
          return viewValue;
        } else {
          ctrl.$setValidity('dateTimeValidation', false);
          return undefined;
        }
      });
    }
  };
});

// from: http://stackoverflow.com/questions/19515477/angular-ui-datepicker-does-not-allow-format-dd-mm-yyyy-when-entered-into-the-inp
minhrDirectives.directive('formattedDate', function ($filter) {
  return {
    require: 'ngModel',
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function (scope, element, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        var val = element.val();
        if(!val) {
          return viewValue;
        }
        var dateStr = $filter('date')(val,'dd/MM/yyyy');
        if(dateStr === undefined) {
          return viewValue;
        }
        var parsed = moment(dateStr, 'DD/MM/YYYY', true);
        var m = moment(parsed, 'DD/MM/YYYY');
        if (!m.isValid()) {
          return '';
        }

        return parsed.toDate();
      });
    }
  };
});
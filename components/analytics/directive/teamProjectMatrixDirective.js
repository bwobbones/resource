minhrDirectives.directive('teamProjectMatrix', function() {

  return {
    restrict: 'E',
    controller: 'TeamProjectMatrixCtrl',
    link: function(scope, element, attrs, TeamProjectMatrixCtrl) {
      TeamProjectMatrixCtrl.init(element);
    }

  };

});
minhrDirectives.directive('skillsMatrix', function () {
    return {
        restrict: 'E',
        controller: 'SkillsMatrixCtrl',
        link: function (scope, element, attrs, SkillsMatrixCtrl) {
            SkillsMatrixCtrl.init(element);
        }
    };
});

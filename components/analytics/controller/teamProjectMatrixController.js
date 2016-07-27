angularModules.config(function ($stateProvider) {

  $stateProvider.state('teamProjectMatrix', {
    url: '/teamProjectMatrix?showFull&removeFooter',
    views: {
      "dataPanel": { templateUrl: "partials/analytics/teamProjectMatrix"}
    },
    resolve:{
      showFull: ['$stateParams', function($stateParams){
          return $stateParams.showFull;
      }],
      removeFooter: ['$stateParams', function($stateParams){
          return $stateParams.removeFooter;
      }]
    }
  });
});

angularModules.controller('TeamProjectMatrixCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$window', 'MatrixService', 
  'MatrixDataService', 'PersonnelService', TeamProjectMatrixCtrl]);

function TeamProjectMatrixCtrl($rootScope, $scope, $state, $stateParams, $window, MatrixService, MatrixDataService) {
  
  $rootScope.showFull = $stateParams.showFull;
  $rootScope.removeFooter = $stateParams.removeFooter;
  $scope.$on('$destroy', function() {
    $rootScope.removeFooter = undefined;
  });
  
  console.log($rootScope.removeFooter);

  this.init = function(directiveElement) {
    $scope.element = directiveElement;
    MatrixDataService.gatherData().then(function() {
      var occupationCounts = MatrixDataService.countDataByFieldType('personnel', 'occupation');
      $scope.options.occupations = [];
      _.each(_.keys(occupationCounts), function(occupation) {
        $scope.options.occupations.push({name: occupation, selected: true});
      });
      MatrixService.draw($scope.options, $scope.element);
    });

  };
  
  $scope.fullScreenMatrix = function() {
    $window.open('/teamProjectMatrix?showFull');
  }

  $scope.options = {};
  $scope.options.zoomIn = true;
  $scope.options.experience = [
    { name: 'Offshore O & G', value: 'offOG', selected: false},
    { name: 'Onshore O & G', value: 'onOG', selected: false},
    { name: 'Onshore Gas', value: 'onGas', selected: false},
    { name: 'Offshore Gas', value: 'offGas', selected: false},
    { name: 'FPSO', value: 'fpso', selected: true},
    { name: 'LNG', value: 'lng', selected: false},
    { name: 'EEHA', value: 'eeha', selected: false},
    { name: 'RPN', value: 'rpn', selected: false},
    { name: 'Other', value: 'other', selected: false}
  ];

  $scope.options.orders = [
    { name: 'Experience', value: 'experience'},
    { name: 'Alphabetical', value: 'alphabetical'}
  ];
  $scope.options.selectedOrder = 'experience';

  $scope.options.personnelOrders = [
    { name: 'Occupation', value: 'occupation'},
    { name: 'Alphabetical', value: 'alphabetical'}
  ];
  $scope.options.selectedPersonnelOrder = 'occupation';

  $scope.$watch('options', function(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    MatrixService.draw($scope.options, $scope.element);
  }, true);

}
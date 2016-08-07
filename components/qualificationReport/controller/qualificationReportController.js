angularModules.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $stateProvider
    .state('qualificationReport', {      
      url: '/qualificationReport',
      views: {
        "searchPanel" : {
          templateUrl : "partials/qualificationReport/reportOptions", 
          controller : ReportOptionsCtrl
        },
        "dataPanel": { templateUrl: "partials/qualificationReport/qualificationReport", controller: QualificationReportCtrl}
      }
    });
});

angularModules.controller('QualificationReportCtrl', ['$scope', '$rootScope', '$http', QualificationReportCtrl]);

function QualificationReportCtrl($scope, $rootScope, $http) {

  $rootScope.fullscreen = false;

  $scope.form = {};

  $http.post('/api/qualificationReport', $scope.form).success(function(data) { 
    $scope.form.qualificationData = data;
  });

  $rootScope.$on('onlyExpiredChanged', function(event, onlyExpired) {
    $http.post('/api/qualificationReport', {'onlyExpired': onlyExpired}).success(function(data) { 
      $scope.form.qualificationData = data;
    });
  }); 

  $scope.hasExpired = function(expiryDate) {
    if(moment(expiryDate).isBefore(moment())) {
      return true;
    }
    return false;
  } 

  $scope.isNearExpiry = function(expiryDate) {
    var upcomingMonth = moment().add(1, 'months');
    if(moment(expiryDate).isAfter(moment()) && moment(expiryDate).isBefore(upcomingMonth)) {
      return true;
    }
    return false;
  }

  $scope.downloadCsv = function() {

    csvDoc = []

    csvDoc.push("Qualification Name,Personnel Name,Certificate #,Institution,Expiry Date,Status");
    angular.forEach($scope.form.qualificationData, function(qual) {
      var line = []
      line.push(qual.qualificationName);
      line.push(getPersonnelName(qual.personnelName));
      line.push(qual.certificateNumber);
      line.push(qual.institution);
      line.push(moment(qual.expiryDate).format("DD/MM/YYYY"));
      if ($scope.hasExpired(qual.expiryDate)) {
        line.push("Expired");
      } else if ($scope.isNearExpiry(qual.expiryDate)) {
        line.push("Nearing Expiry");
      } else {
        line.push("Valid");
      }

      csvDoc.push(line.join());
    });

    var blob = new Blob([csvDoc.join("\n")], { type: "text/csv" });
    saveAs(blob, "qualificationReport.csv");
    
  };

  function getPersonnelName(oldPersonnelName) {
    var nameList = oldPersonnelName.split(",");
    return nameList[1] + " " + nameList[0];
  }

}
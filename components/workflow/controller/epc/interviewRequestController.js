angularModules.controller('InterviewRequestCtrl', ['$scope', 'PersonnelService', 'GoogleLocationService',
  'FollowupService', 'EmailService', 'hotkeys', InterviewRequestCtrl]);

function InterviewRequestCtrl($scope, PersonnelService, GoogleLocationService,
  FollowupService, EmailService, hotkeys) {

  $scope.personnelWorkflow.submissionDate =
    $scope.personnelWorkflow.submissionDate || moment();

  $scope.dateOptions = {
    dateFormat: 'd/m/yy',
    changeMonth: true,
    changeYear: true
  };

  $scope.$watch('personnelWorkflow.interviewRequested', function(newValue, oldValue) {
    if (newValue !== oldValue && !$scope.personnelWorkflow.comments && newValue === 'No') {
      $scope.personnelWorkflow.comments = 'Not requested to interview for ' + $scope.jobDescription.position + ' with ' + $scope.jobDescription.company + ' because';
    }
  });

  $scope.$on('postWorkflowSave', function() {
    if ($scope.personnelWorkflow.submissionDate) {
      var followup = {
        scope: $scope,
        personnelId: $scope.personnelData._id,
        time: $scope.personnelWorkflow.submissionDate,
        contact: $scope.user,
        message: 'Confirm interview request for ' +
                $scope.personnelData.name + ' ' + $scope.personnelData.surname + ' for ' +
                $scope.jobDescription.position + ' at ' + $scope.jobDescription.company
      };
      FollowupService.addFollowup(followup);
      $scope.personnelWorkflow.comments = 'Interview requested for ' +
        $scope.jobDescription.position +
        ' with ' + $scope.jobDescription.company +
        ' to take place on ' + $scope.personnelWorkflow.interviewDate +
        ' with ' + $scope.personnelWorkflow.interviewReportTo +
        ' at ' + $scope.personnelWorkflow.interviewLocation;
    }
  });

  $scope.sendDetails = function() {
    PersonnelService.find($scope.personnelData._id).then(function(httpResult) {
      EmailService.send(httpResult.data.hcemail,
        'Interview with ' + $scope.jobDescription.company,
        'Dear ' + $scope.personnelData.name + ',%0A%0A  Hello.%0A%0AThanks,%0A%0A' + $scope.user.fullname);
    });
  };

  $scope.getAddress = function(searchText) {
    return GoogleLocationService.findAddresses(searchText).then(function (result) {
      return result;
    });
  };

  $scope.hoverInInterview = function(shortcutKey) {
    $scope.shortcutKeyInterview = shortcutKey;
  };

  $scope.hoverInSendDetails = function(shortcutKey) {
    $scope.shortcutKeySendDetails = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyInterview = undefined;
    $scope.shortcutKeySendDetails = undefined;
  };

  hotkeys.add({ combo: 'y', description: 'Interview requested',
    callback: function() {
      $scope.personnelWorkflow.interviewRequested = 'Yes';
    }
  });

  hotkeys.add({ combo: 'n', description: 'Interview not requested',
    callback: function() {
      $scope.personnelWorkflow.interviewRequested = 'No';
    }
  });

  hotkeys.add({ combo: 's', description: 'Send details to personnel',
    callback: function() {
      $scope.sendDetails();
    }
  });

}
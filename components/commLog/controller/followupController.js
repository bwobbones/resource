angularModules.controller('FollowupCtrl', ['$scope', '$modalInstance', 'AlertService',
  'PersonnelService', 'UserService', 'personnelData', 'commLogData', 'hotkeys', 'pForm',
  FollowupCtrl]);

function FollowupCtrl($scope, $modalInstance, AlertService, PersonnelService, UserService,
  personnelData, commLogData, hotkeys, pForm) {

	$scope.personnelData = personnelData;
  $scope.commLog = commLogData;

  $scope.followup = {
    dateDue: new moment().add('d', 1).format('DD/MM/YYYY HH:mm'),
    completed: false
  };

  UserService.getUsers().then(function(contacts) {
    $scope.contacts = contacts;
    $scope.followup.contact = _.find(contacts, function(contact){ return contact._id === $scope.user._id; });
  });

  $scope.followupMessage = $scope.commLog.message ? $scope.commLog.message.trunc(60) : "";

  $scope.addFollowupToCommLog  = function(followupForm) {
    if (followupForm.$valid) {
      if (!$scope.commLog.followup) {
        $scope.commLog.followup = [];
      }

      $scope.followup._id = new ObjectId();
      $scope.commLog.followup.push($scope.followup);
      PersonnelService.save($scope, personnelData, pForm).then(function(httpResult) {
        AlertService.add("success", "Followup added");
      });
      $modalInstance.close(1);
    }
  };

  $scope.cancel = function() {
      $modalInstance.close(1);
  };

  $scope.hoverIn = function(shortcutKey) {
    $scope.shortcutKey = shortcutKey;
    $scope.showShortcut = true;
  };

  $scope.hoverOut = function() {
    $scope.showShortcut = false;
  };

  hotkeys.add({ combo: 'p', description: 'Make a Phone followup', 
    callback: function() {
      $scope.followup.type = 'Phone';
    }
  });

  hotkeys.add({ combo: 'e', description: 'Make an Email followup', 
    callback: function() {
      $scope.followup.type = 'Email';
    }
  });

  hotkeys.add({ combo: 'space', description: 'Edit followup', 
    callback: function() {
      angular.element("[name='followup.message").focus();
    }
  });

}
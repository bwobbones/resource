angularModules.controller('AvailableCtrl', ['$scope', '$rootScope', 'UserService',
  'hotkeys', AvailableCtrl]);

function AvailableCtrl($scope, $rootScope, UserService, hotkeys) {

  $scope.personnelWorkflow.type = undefined;
  $scope.personnelWorkflow.direction = undefined;
  $scope.$parent.personnelWorkflow.comments = undefined;
  $scope.personnelWorkflow.dateEntered = moment().format('DD/MM/YYYY HH:mm');

  UserService.getUsers().then(function(contacts) {
    $scope.contacts = contacts;
    $scope.personnelWorkflow.contact = _.find(contacts, function(contact){ return contact._id === $scope.user._id; });
  });

  $scope.hasPreviousLogs = function() {
    return $scope.personnelWorkflow.previousLogs;
  };

  $scope.togglePrevious = function() {
    $scope.showPrevious = !$scope.showPrevious;
  };

  $scope.$on('postWorkflowSave', function() {
    var previousLog = {
      type: $scope.personnelWorkflow.type,
      direction: $scope.personnelWorkflow.direction,
      dateEntered: $scope.personnelWorkflow.dateEntered,
      comments: $scope.personnelWorkflow.comments,
      contact: {
        fullname: $scope.personnelWorkflow.contact.fullname
      }
    };
    ($scope.personnelWorkflow.previousLogs = $scope.personnelWorkflow.previousLogs || []).push(previousLog);
    $rootScope.$broadcast('updatedJobDescriptionChild');
  });

  $scope.hoverInType = function(shortcutKey) {
    $scope.shortcutKeyType = shortcutKey;
  };

  $scope.hoverInDirection = function(shortcutKey) {
    $scope.shortcutKeyDirection = shortcutKey;
  };

  $scope.hoverInPrevious = function(shortcutKey) {
    $scope.shortcutKeyPrevious = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyType = undefined;
    $scope.shortcutKeyDirection = undefined;
    $scope.shortcutKeyPrevious = undefined;
  };

  hotkeys.add({ combo: 'p', description: 'A phone conversation',
    callback: function() {
      $scope.personnelWorkflow.type = 'Phone';
    }
  });

  hotkeys.add({ combo: 'e', description: 'An email',
    callback: function() {
      $scope.personnelWorkflow.type = 'Email';
    }
  });

  hotkeys.add({ combo: 'i', description: 'Incoming log',
    callback: function() {
      $scope.personnelWorkflow.direction = 'Incoming';
    }
  });

  hotkeys.add({ combo: 'o', description: 'Outgoing log',
    callback: function() {
      $scope.personnelWorkflow.direction = 'Outgoing';
    }
  });

  hotkeys.add({ combo: 'r', description: 'Show previous',
    callback: function() {
      $scope.togglePrevious();
    }
  });

}
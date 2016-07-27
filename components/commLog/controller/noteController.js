angularModules.controller('NoteCtrl', ['$scope', '$rootScope', '$modalInstance', 'NoteService', 'UserService',
  'hotkeys', 'personnelData', 'pForm', NoteCtrl
]);

function NoteCtrl($scope, $rootScope, $modalInstance, NoteService, UserService, hotkeys, personnelData, pForm) {

  $scope.personnelData = personnelData;

  // defaults
  $scope.note = {
    dateEntered: new moment().format('DD/MM/YYYY HH:mm')
  };

  UserService.getUsers().then(function(contacts) {
    $scope.contacts = contacts;
    $scope.note.contact = _.find(contacts, function(contact) {
      return contact._id === $scope.user._id;
    });
  });

  $scope.dateOptions = {
    dateFormat: 'd/m/yy'
  };

  $scope.addNote = function() {
    NoteService.addToPersonnel($scope, $scope.personnelData, $scope.note, pForm);
    $rootScope.$broadcast('noteSavedEvent');
    $modalInstance.close(1);
  };

  $scope.cancel = function() {
    $modalInstance.close(1);
  };

  $scope.hoverInType = function(shortcutKey) {
    $scope.shortcutKeyType = shortcutKey;
  };

  $scope.hoverInDirection = function(shortcutKey) {
    $scope.shortcutKeyDirection = shortcutKey;
  };

  $scope.hoverInMessage = function(shortcutKey) {
    $scope.shortcutKeyMessage = shortcutKey;
  };

  $scope.hoverOut = function(field, shortcutKey) {
    $scope.shortcutKeyType = undefined;
    $scope.shortcutKeyDirection = undefined;
    $scope.shortcutKeyMessage = undefined;
  };

  hotkeys.add({
    combo: 'p',
    description: 'A phone conversation',
    callback: function() {
      $scope.note.type = 'Phone';
    }
  });

  hotkeys.add({
    combo: 'e',
    description: 'An email',
    callback: function() {
      $scope.note.type = 'Email';
    }
  });

  hotkeys.add({
    combo: 'i',
    description: 'Incoming log',
    callback: function() {
      $scope.note.direction = 'Incoming';
    }
  });

  hotkeys.add({
    combo: 'o',
    description: 'Outgoing log',
    callback: function() {
      $scope.note.direction = 'Outgoing';
    }
  });

  hotkeys.add({
    combo: 'space',
    description: 'Edit history log',
    callback: function() {
      angular.element("[name='note.message").focus();
    }
  });

}

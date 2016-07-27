angularModules.controller('PersonnelNotesCtrl', ['$scope', '$modal', '_', 'hotkeys',
  'UserService', PersonnelNotesCtrl
]);

function PersonnelNotesCtrl($scope, $modal, _, hotkeys, UserService) {

  if (!$scope.form) $scope.form = {};

  // this is a data fix - contacts were being stored as strings - in the distant future this should be removed
  UserService.getUsers().then(function(contacts) {
    _.each($scope.form.notes, function(note) {
      if (typeof note.contact === 'string') {
        note.contact = _.find(contacts, function(contact) {
          return contact.username === $scope.user.username;
        });
      }
    });
  });

  $scope.hasNotes = function() {
    return $scope.form &&
      $scope.form.notes &&
      $scope.form.notes.length > 0 ? true : false;
  };

  function findNoteByNoteId(noteId) {
    return _.find($scope.form.notes, function(note) {
      return note._id === noteId;
    });
  }

  $scope.hoverIn = function(note) {
    return note.showFollowup = true;
  };

  $scope.hoverOut = function(note) {
    return note.showFollowup = false;
  };

  hotkeys.add({
    combo: 'h',
    description: 'Add a note',
    callback: function() {
      $scope.addNote()
    }
  });

}

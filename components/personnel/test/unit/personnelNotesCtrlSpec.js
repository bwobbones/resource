describe("PersonnelNotes", function() {

  var personnelNotesCtrl;
  var scope;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope) {

    // create a dummy scope
    rootScope = $rootScope;
    scope = $rootScope.$new();

    scope.personnel = {};
    scope.form = {};

    // set the user
    scope.user = {};
    scope.user.username = 'greg';

    // create the constructor
    personnelNotesCtrl = $controller(PersonnelNotesCtrl, {
      $scope: scope
    });

  }));

  afterEach(function() {});

  describe("PersonnelNotesCtrl", function() {

    it('should tell whether notes exist', function() {
      // undefined
      scope.form = {};
      expect(scope.hasNotes()).toBe(false);

      // empty
      scope.form.notes = [];
      expect(scope.hasNotes()).toBe(false);

      // not empty
      scope.form.notes.push({
        dateEntered: '01/01/2014 10:10',
        contact: 'greg'
      });
      expect(scope.hasNotes()).toBe(true);
    });

  });

});

// mock services
var mockPersonnelData = {
  name: 'greg',
  commLog: []
};

var mockModalInstance = {
  close: function(value) {
    // noop
  }
};

var mockAlertService = {
  add: function(value) {
    // noop
  }
};

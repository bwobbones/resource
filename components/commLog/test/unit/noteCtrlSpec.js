describe("Note", function() {

  var noteCtrl;
  var rootScope;
  var scope;
  var AlertService;
  var personnelData;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope, HtmlifyDataService) {

    // create a dummy scope
    rootScope = $rootScope;
    scope = $rootScope.$new();

    scope.personnelData = {};
    scope.personnelData.note = [];

    scope.pForm = {};
    scope.pForm.$valid = true;

    // set the user
    scope.user = {};
    scope.user._id = 123;
    scope.user.username = 'greg';

    // create the constructor
    noteCtrl = $controller(NoteCtrl, {
      $scope: scope,
      $rootScope: rootScope,
      $modalInstance: mockModalInstance,
      AlertService: mockAlertService,
      HtmlifyDataService: HtmlifyDataService,
      hotkeys: mockHotKeys,
      personnelData: mockPersonnelData,
      pForm: {}
    });

    // not sure why I need this one?  why does the controller init add notes?
    scope.personnelData.note = [];

  }));

  afterEach(function() {});

  describe("NoteCtrl", function() {

    it('should add a note to a personnel when none exist', function() {

      scope.note = {
        _id: 0,
        dateEntered: '1/1/2014',
        contact: 'greg'
      };
      scope.addNote();

      expect(scope.personnelData.notes.length).toBe(1);
      expect(scope.personnelData.notes[0].contact).toBe('greg');
    });

    it('should add a note to an existing note collection', function() {

      scope.personnelData.note = [{
        _id: 0,
        dateEntered: '1/1/2014',
        contact: 'greg'
      }];
      scope.note = {
        _id: 0,
        dateEntered: '1/1/2015',
        contact: 'lexi'
      };

      scope.addNote();

      expect(scope.personnelData.notes.length).toBe(2);
      expect(scope.personnelData.notes[1].contact).toBe('lexi');

    });

    it('should create an _id if none exists', function() {
      scope.note = {
        dateEntered: '1/1/2014',
        contact: 'greg'
      };
      scope.addNote();
      expect(scope.personnelData.notes[0]._id).toBeDefined();
    });

    it('should create a default date entered set to now', function() {
      expect(scope.note.dateEntered).toMatch(/\d\d\/\d\d\/\d\d\d\d.*\d\d:\d\d/);
    });

    it('should show all comm logs', function() {
      addSampleNotes(scope);
      expect(scope.personnelData.notes.length).toBe(4);
    });

    it('should retain formatting in messages', function() {
      scope.personnelData.notes = [];
      scope.note = {
        dateEntered: '1/1/2014',
        contact: 'greg',
        message: 'a\nb\nc'
      };
      scope.addNote();

      expect(scope.personnelData.notes[0].message).toBe('a<br/>b<br/>c');
    });

  });

});

function addSampleNotes(scope) {
  scope.personnelData = {};
  scope.note = {
    dateEntered: '01/01/2014 10:10',
    contact: 'greg'
  };
  scope.addNote();
  scope.note = {
    dateEntered: '01/02/2014 10:09',
    contact: 'lexi'
  };
  scope.addNote();
  scope.note = {
    dateEntered: '01/02/2014 10:09',
    contact: 'jack'
  };
  scope.addNote();
  scope.note = {
    dateEntered: '01/02/2014 10:09',
    contact: 'alex'
  };
  scope.addNote();
}

// mock services
var mockPersonnelData = {
  name: 'greg',
  notes: []
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

var mockHtmlifyDataService = {
  htmlify: function(data) {
    // empty
  }
};

var mockHotKeys = {
  add: function() {
    // empty
  }
};

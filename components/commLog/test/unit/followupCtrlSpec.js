describe("Personnel", function() {
  
  var commLogCtrl;
  var rootScope;
  var scope;
  var AlertService;
  var personnelData;
  var httpBackend;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope, $httpBackend, $timeout, $q, UserService, PersonnelService) {

    // create a dummy scope
    rootScope = $rootScope;
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    timeout = $timeout;

    scope.personnelData = {};

    scope.followupForm = {};
    scope.followupForm.$valid = true;

    // set the user
    scope.user = {};
    scope.user._id = 123;
    scope.user.username = 'greg';

    // simulated user database
    var users = {users: [
        {_id: 0, username: 'greg'},
        {_id: 1, username: 'mark'}
    ]};

    spyOn(PersonnelService, "save").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({
        data: {
          _id: 1
        }
      });
      return deferred.promise;
    });

    httpBackend.expectGET('/api/users').respond(users);

    // create the constructor
    followupCtrl = $controller(FollowupCtrl, {
      $scope: scope,
      $rootScope: rootScope,
      $modalInstance: mockModalInstance,
      AlertService: mockAlertService,
      personnelData: mockPersonnelData,
      commLogData: mockCommLogData,
      $http: httpBackend,
      UserService: UserService,
      pForm: {}
    });

    httpBackend.flush();
    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe("FollowupCtrl", function() {

    it('should be possible to add a followup to a commLog', function() {

      scope.commLog = {dateEntered: '01/01/2014 10:10', contact: 'greg', message: 'hello'};

      scope.followup = {dateDue: '01/01/2014 10:10', message: 'followup test', completed: false, contact: scope.user};

      scope.addFollowupToCommLog(scope.followupForm);

      expect(scope.commLog.followup.length).toBe(1);

      expect(scope.commLog.followup[0].contact._id).toBe(123);
      expect(scope.commLog.followup[0].dateDue).toMatch(/\d\d\/\d\d\/\d\d\d\d.*\d\d:\d\d/);
      expect(scope.commLog.followup[0].message).toBe('followup test');
      expect(scope.commLog.followup[0].completed).toBe(false);
      expect(scope.commLog.followup[0]._id).toBeDefined();

    });

    it('should add a due date 24hrs in the future', function() {
      var now = new moment();
      expect(moment(scope.followup.dateDue, 'DD/MM/YYYY HH:mm').add('m', 1).diff(now, 'days')).toBe(1);
    });

    it('should gather all users in the system', function() {
      expect(scope.contacts.length).toBe(2);
      expect(scope.contacts[0].username).toBe('greg');
    }); 

  });

});

// mock services
var mockPersonnelData = {
  name: 'greg',
  commLog: []
};

var mockCommLogData = {
  _id: 0, 
  dateEntered: '1/1/2014', 
  contact: 'greg'
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
'use strict';

describe('jobDescription', function() {
  
  var scope;
  var rootScope;
  var httpBackend;
  var modal;
  var jobDescriptionService;
  var alertService;
  var alertSpy;
  var q;

  beforeEach(module('resource'));
  beforeEach(inject(function($rootScope, $httpBackend, $modal, $q, JobDescriptionService, AlertService) {

    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    modal = $modal;
    jobDescriptionService = JobDescriptionService;
    alertService = AlertService
    q = $q;

    alertSpy = spyOn(alertService, 'add').and.callFake(function() {
      return {};
    });

    scope.form = {};
    
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('JobDescriptionService', function() {

    it('should reset the job description form back to its default state', function() {

      var expectedResult = {
        worktype: 'fulltime',
        offshore: false,
        status: 'open'
      };

      // set everything
      scope.form._id = 1;
      scope.form.company = '1';
      scope.form.position = '1';
      scope.form.positionnumber = 233;
      scope.form.worktype = undefined;
      scope.form.department = '1';
      scope.form.replacement = '1';
      scope.form.datecompleted = '01/01/2001';
      scope.form.worklocation = '1';
      scope.form.daterequired = '01/01/2001';
      scope.form.reportingto = '1';
      scope.form.reportingname = '1';
      scope.form.expectedstart = '01/01/2001';
      scope.form.expat = false;
      scope.form.qualifications = [];
      scope.form.offshore = true;
      scope.form.keywords = '1';
      scope.form.details = '1';
      scope.form.duration = '1';
      scope.form.receivedfrom = '1';
      scope.form.term = '1';
      scope.form.rate = '1';
      scope.form.files = [];
      scope.form.openpositions = [];
      scope.form.replacementperson = '1';
      scope.form.replacementreason = '1';
      scope.form.similarPosition = '1';
      scope.form.status = undefined;

      jobDescriptionService.reset(scope);

      expect(scope.form).toEqual(expectedResult);
    });

    it('should save the job description if the mandatory fields have been entered', function() {
      var jobDescriptionForm = {};
      jobDescriptionForm.$valid = true;

      httpBackend.expectPOST('/api/jobDescription').respond(200);
      jobDescriptionService.save(scope.form, jobDescriptionForm);

      httpBackend.flush();
    });

    it('should open the mandatory fields dialog if the have not been entered', function() {
      var jobDescriptionForm = {};
      jobDescriptionForm.$valid = false;
      jobDescriptionService.save(scope.form, jobDescriptionForm);

      expect(alertSpy).toHaveBeenCalledWith('error', 'All required fields are not filled correctly', 'Error!');
    });

    it('should open the mandatory fields dialog if there is no jobDescription data', function() {
      var jobDescriptionForm = {};
      jobDescriptionForm.$valid = true;

      jobDescriptionService.save(undefined, jobDescriptionForm);

      expect(alertSpy).toHaveBeenCalledWith('error', 'All required fields are not filled correctly', 'Error!');
    });

    it('should update personnel within a job description when saving', function() {

      var jobDescription = {
        _id: 0,
        personnels: [
          { _id: 0, acceptable: true, currentWorkflow: 0 },
          { _id: 1, acceptable: true, currentWorkflow: 0 }
        ]
      };

      var changedPersonnels = [
        { _id: 0, acceptable: false, currentWorkflow: 1 },
        { _id: 1, acceptable: false, currentWorkflow: 1 }
      ];
      scope.pForm = {};
      scope.pForm.$valid = true;

      httpBackend.expectPOST('/api/jobDescription').respond(200);

      jobDescriptionService.save(jobDescription, scope.pForm, changedPersonnels);
      httpBackend.flush();

      expect(jobDescription.personnels).toEqual(changedPersonnels);

    });

  });

});

// I WENT TO A LOT OF TRUBLE TO SO CLOSE GIVE MY SHIRT AWAY BUT WHEN YOU GIVE IT TO MAT it is the right thing to do!!!.23/10/15.
// mia
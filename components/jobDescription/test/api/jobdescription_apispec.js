'use strict';

var _ = require('lodash');
var api = require('../../../../routes/api');
var db = require('../../../../routes/database');

xdescribe('Job Description Suite', function() {

  var res;
  var req;

  beforeEach(function() {
    req = {db: db.getConnectionWithString('mongodb://localhost:27017/minhr_test')};
    res = jasmine.createSpyObj(res,['json']);
  });

  it('should load all of the test data', function(done) {

    databaseWrapper(function() {
      
      req.params = {};
      req.param = function() {};
      
      api.jobDescriptions(req, res, function() {
        expect(res.json.calls.mostRecent().args[0].jobDescriptions.length).toBe(3);
        expect(_.find(res.json.calls.mostRecent().args[0].jobDescriptions, { company : 'Company 1'})).
          toEqual(jasmine.objectContaining({ company: 'Company 1' }));
        done();
      });
    });

  }, 10000);

  it('should only return the job description with id zero', function(done) {

    var req = {params:{id:0}};
    var expectedData = { _id : 0, company : 'Company 1', position : 'Position 1' };

    databaseWrapper(function() {
      api.jobDescription(req, res, function() {
        expect(res.json.calls.mostRecent().args[0]).toEqual(expectedData);
        done();
      });
    });
  }, 10000);

  it('should return empty for invalid ids', function(done) {
    var req = {params:{id:20}};

    databaseWrapper(function() {
      api.jobDescription(req, res, function() {
        expect(res.json.calls.mostRecent().args[0].length).toEqual(0);
        done();
      });
    });
  }, 10000);

  it('should add a new jobDescription', function(done) {
    var req = {body:{company:'Company 3', position:'Position 3'}};
    var expectedData = { company: 'Company 3', position: 'Position 3' };

    databaseWrapper(function() {
      api.saveJobDescription(req, res, function() {
        expect(res.json.calls.mostRecent().args[0].company).toEqual(expectedData.company);
        expect(res.json.calls.mostRecent().args[0].position).toEqual(expectedData.position);
        done();
      });
    });
  }, 10000);

  it('should return an edited version of the personnel', function(done) {
    var req = {params:{_id:0}, body:{_id:0, position:'Position 4'}};

    databaseWrapper(function() {
      api.saveJobDescription(req, res, function() {
        expect(res.json.calls.mostRecent().args[0]).toEqual({ _id: 0, position : 'Position 4' });
        done();
      });
    });
  }, 10000);

  it('should delete the first personnel', function(done) {

    databaseWrapper(function() {
      
      var req = {params:{}, param:function() {}};
      
      api.jobDescriptions(req, res, function() {
        expect(res.json.calls.mostRecent().args[0].jobDescriptions.length).toBe(3);

        var deleteReq = {params:{id:0}};
        api.deleteJobDescription(deleteReq, res);

        api.jobDescriptions(req, res, function() {
          expect(res.json.calls.mostRecent().args[0].jobDescriptions.length).toBe(2);
          done();
        });

      });
    });
  });

}, 10000);



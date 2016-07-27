var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var format = require('util').format;
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
require('jasmine-expect');
var moment = require('moment');
var api = require('../../../../routes/api');
var personnel = require('../../../../routes/api/personnel');
var search = require('../../../../routes/api/search');
var login = require('../../../../routes/api/login');
var typeaheadfielddata = require('../../../../routes/api/typeAheadFieldData');
var matrix = require('../../../../routes/api/matrix');
var rewire = require('rewire');

var elasticMock = {
  search: function(params, cb) {
    var resp = {
      hits: {
        hits: [{
          _source: {
            personnelId: testId
          }
        }]
      }
    };
    cb(undefined, resp);
  }
};

// rewire allows the __set__ call to inject the elasticMock service
api = rewire('../../../../routes/api');
search = rewire('../../../../routes/api/search');

var testId = '554a29c3d4c6cbaffeb78331';
var testFirstname = 'Leyshire';
var testSurname = 'Jeffjeffing';
var testSurname2 = 'Jeffnesston';

describe("Personnel Suite", function() {

  var res;
  var req;

  beforeEach(function() {
    req = null;
    res = jasmine.createSpyObj(res,['json', 'download']);
    api.__set__('client', elasticMock);
  });

  // personnel
  it("should load all of the test data", function(done) {

    personnel.personnels(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(16);
      expect(res.json.mostRecentCall.args[0].personnels).toContain( jasmine.objectContaining( {'surname': testSurname}) );
      done();
    });

  });
  
  // personnel
  it('should load all of the test data, but only the first and last names', function(done) {

    personnel.personnelsNameOnly(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels).toContain( jasmine.objectContaining( {'surname': testSurname}) );
      expect(res.json.mostRecentCall.args[0].personnels[0].hchomephone).toBeUndefined();
      done();
    });

  });

  // personnel
  it("should only return one personnel", function(done) {

    var req = {params:{id: testId}};

    personnel.personnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].surname).toEqual(testSurname);
      expect(res.json.mostRecentCall.args[0].surname).not.toEqual(testSurname2);
      done();
    });

  });

  // personnel
  it("should return empty for invalid id's", function(done) {

    var req = {params:{id:'20'}};

    personnel.personnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].length).toEqual(0);
      done();
    });

  });

  // personnel
  it("should add a new personnel", function(done) {

    var req = {body:{name:'Jack', hchomephone:'33333333'}};

    personnel.addPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].name).toEqual('Jack');
      expect(res.json.mostRecentCall.args[0].hchomephone).toEqual('33333333');
      
      // undelete
      var req = {params:{id: res.json.mostRecentCall.args[0]._id }};
      personnel.reallyDeletePersonnel(req, res, function() {
        personnel.personnels(req, res, function() {
          expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(16);
          done();
        });
      });
    });

  });

  // personnel
  it("should return an edited version of the personnel", function(done) {

    req = { params:{ _id: testId }, body:{ _id: testId, surname: testSurname + 'edited' }};

    personnel.updatePersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].surname).toEqual(testSurname + 'edited');
      
      // put it back
      req = { params:{ _id: testId }, body:{ _id: testId, surname: testSurname }};
      personnel.updatePersonnel(req, res, function() {
        expect(res.json.mostRecentCall.args[0].surname).toEqual(testSurname);
        done();
      });
    });

  });

  // personnel
  it("should mark the first personnel as deleted", function(done) {

    personnel.personnels(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(16);
      
      req = {params:{id: testId }};
      personnel.deletePersonnel(req, res, function() {
  
        personnel.personnels(req, res, function() {
          expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(15);
          
          // undelete
          personnel.restorePersonnel(req, res, function() {
            personnel.personnels(req, res, function() {
              expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(16);
              done();
            });
          });
          
        });
  
      });
    });

  });
  
  it('should be possible to add the same personnel name twice', function(done) {
    
    var ids = [];

    // create one jack
    var req = {body:{name:'jack', surname:'lucas'}};
    personnel.addPersonnel(req, res, function() {
      ids.push(res.json.mostRecentCall.args[0]._id);
      
      // create two jacks
      var req2 = {body:{name:'jack', surname:'lucas'}};
      personnel.addPersonnel(req2, res, function() {
        ids.push(res.json.mostRecentCall.args[0]._id);
        
        // search for him
        var query = {};
        query.personnelName = 'lucas';
        var req = {body:query};
    
        // should be 2 of him
        search.searchPersonnel(req, res, function() {
          expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(2);
          
          var count = 0;
          _.each(ids, function(jackId) {
            var req = {params:{id: jackId }};
            personnel.reallyDeletePersonnel(req, res, function() {
              personnel.personnels(req, res, function() {
                count = count +1;
                if (count === ids.length) {
                  done();
                }
              });
            });
          });
          
        });
        
      });
    
    });
    
  })

  // search
  it('should find personnel by position', function(done) {

    var query = {};
    query.similarPosition = "Jumbo Operator";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(6);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should find personnel by surname', function(done) {

    var query = {};
    query.personnelName = testSurname;

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should find personnel by first name', function(done) {

    var query = {};
    query.personnelName = testFirstname;

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(2);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  xit('should find personnel by first name and surname', function(done) {
    var query = {};
    query.personnelName = testFirstname + ' ' + testSurname;

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(2);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });
  });

  // search
  it('should find personnel by partial surname', function(done) {

    var query = {};
    query.personnelName = 'Jeffjeff';

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });
    
  });

  // search
  it('should find personnel by occupation', function(done) {

    var query = {};
    query.occupation = "Railway Electrician";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(7);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should not find personnel by invalid position', function(done) {

    var query = {};
    query.similarPosition = "Invalid position";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(0);
      done();
    });

  });

  // search
  it('should match on a partial position entry', function(done) {

    var query = {};
    query.occupation = "Railway";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(7);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should find personnel on position regardless of case', function(done) {

    var query = {};
    query.similarPosition = "jumbo operator";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(6);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should find a personnel by qualification', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "Maritime"});

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(5);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should not find personnel by invalid qualification', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "Invalid"});

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(0);
      done();
    });

  });

  // search
  it('should match on a partial qualification entry', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "Mari"});

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(5);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should match on a qualification regardless of case', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "maritime"});

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(5);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });
    
  });

  // search
  it('should restrict by multiple qualifications', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "Electrical"});
    query.qualifications.push({"name" : "Confined"});

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: 'Ingtonshire'}));
      done();
    });

  });

  // search
  it('should match one person with offshore experience', function(done) {

    var query = {};
    query.offshore = true;

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      done();
    });

  });

  // search
  it('should match one person with eeha experience', function(done) {

    var query = {};
    query.eeha = true;

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(15);
      done();
    });

  });
  
  // search
  it('should match one person with offshore experience and a particular role', function(done) {

    var query = {};
    query.offshore = true;
    query.position = "Jumbo Operator";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should match personnel on position and qualification', function(done) {

    var query = {};
    query.qualifications = [];
    query.qualifications.push({"name" : "Maritime"});
    query.similarPosition = "Jumbo Operator";

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(2);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  it('should return nothing on an empty query', function(done) {

    var query = {};

    var req = {body:query};

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(0);
      done();
    });

  });

  it('should find a user with a keyword match', function(done) {

    var req = {body: {keywords: 'Greg2'}};

    search.__set__('client', elasticMock);

    search.searchPersonnel(req, res, function() {
      expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
      expect(res.json.mostRecentCall.args[0].personnels).toContain(jasmine.objectContaining({surname: testSurname}));
      done();
    });

  });

  // search
  it('should not return deleted personnel', function(done) {
    
    var req = {params:{id: testId }};
    personnel.deletePersonnel(req, res, function() {

      var query = {};
      query.personnelName = testSurname;
  
      var req = {body:query};
      search.searchPersonnel(req, res, function() {
        expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(0);
        
        // undelete
        var req = {params:{id: testId }};
        personnel.restorePersonnel(req, res, function() {
          
          var query = {};
          query.personnelName = testSurname;
          req = {body:query};
          search.searchPersonnel(req, res, function() {
            expect(res.json.mostRecentCall.args[0].personnels.length).toEqual(1);
            done();
          });
        });

      });

    });

  });

  // login
  it('should be possible to reset the user password', function(done) {

    var req = {body:{username: 'greg', password: 'changedgreg'}};

    login.resetPassword(req, res, function() {
      expect(res.json.mostRecentCall.args[0].password).toBe('changedgreg');
      
      var req = {body:{username: 'greg', password: 'greg'}};
      login.resetPassword(req, res, function() {
        expect(res.json.mostRecentCall.args[0].password).toBe('greg');
        done();
      });
    });

  });

  // login
  it('should be possible to login with good credentials', function(done) {

    var req = {body:{username: 'greg', password: 'greg'}};
    login.loginUser(req, res, function() {
      expect(res.json.mostRecentCall.args[0].success).toBe(true);
      expect(res.json.mostRecentCall.args[0].user.username).toBe('greg');
      done();
    });

  });

  // login
  it('should not be possible to login with a bad username', function(done) {

    var req = {body:{username: 'badUser', password: 'badPassword'}};
    login.loginUser(req, res, function() {
      expect(res.json.mostRecentCall.args[0].success).toBe(false);
      expect(res.json.mostRecentCall.args[0].message).toBe('Authentication failed. User not found.');
      done();
    });
    
  });

  // login
  it('should not be possible to login with a bad password', function(done) {

    var req = {body:{username: 'greg', password: 'badPassword'}};
    login.loginUser(req, res, function() {
      expect(res.json.mostRecentCall.args[0].success).toBe(false);
      expect(res.json.mostRecentCall.args[0].message).toBe('Authentication failed. Wrong password.');
      done();
    });

  });
  
  // login
  it('returns all users', function(done) {

    login.users(req, res, function() {
      expect(res.json.mostRecentCall.args[0].users.length).toBe(2);
      done();
    });

  });

  // typeaheads
  it("aggregates all of the role names", function(done) {

    var req = {params:{fieldName: "roleName", searchKey: "Jumbo"} };

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData[0].roleName).toBe('Jumbo Operator');
      done();
    });

  });

  // typeahead
  it("aggregates all of the projects", function(done) {

    var req = {params:{fieldName: "projects", searchKey: "Tingold"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(1);
      expect(res.json.mostRecentCall.args[0].typeAheadData[0].text).toBe('Tingold');
      done();
    });

  });

  // typeaheads
  it("aggregates all of the projects even when they only differ by a number at the end", function(done) {

    var req = {params:{fieldName: "projects", searchKey: "Tin"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(14);
      done();
    });

  });

  // typeaheads
  it("aggregates all of the clients", function(done) {

    var req = {params:{fieldName: "client", searchKey: "BHP"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(1);
      expect(res.json.mostRecentCall.args[0].typeAheadData[0].client).toBe('BHP');
      done();
    });

  });

  // typeahrads
  it("aggregates all of the qualification names", function(done) {

    var req = {params:{fieldName: "qualification", searchKey: "Maritime"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(1);
      done();
    });

  });
  
  // typeaheads 
  it("aggregates all of the training names", function(done) {

    var req = {params:{fieldName: "training", searchKey: "Plant Operator Licensing"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(1);
      done();
    });

  });

  // typeaheads
  it("aggregates all of the training institutions", function(done) {

    var req = {params:{fieldName: "institution", searchKey: "Edith Cowan University"}};

    typeaheadfielddata.typeAheadFieldData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].typeAheadData.length).toBe(1);
      done();
    });

  });

  // matrix
  it('assembles the projects and personnels', function(done) {

    matrix.assembleProjectTeamData(req, res, function() {
      expect(res.json.mostRecentCall.args[0].teamProjectData.projects.length).toBe(220);
      expect(res.json.mostRecentCall.args[0].teamProjectData.projects).toContain(jasmine.objectContaining({name: 'Quetin'}));
      expect(_.find(res.json.mostRecentCall.args[0].teamProjectData.projects, { name : 'Quetin'}).personnel.length).toBe(1);
      done();
    });

  });

});
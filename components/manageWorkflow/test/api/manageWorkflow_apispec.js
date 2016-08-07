var _ = require('lodash');
var format = require('util').format;

var done = false;

var api = require('../../../../routes/api');

xdescribe("Manage Workflow Suite", function () {

  var res;
  var req;

  beforeEach(function() {
    req = {db: db.getConnectionWithString('mongodb://localhost:27017/minhr_test')};
    res = jasmine.createSpyObj(res,['json']);
  });

  it('should gather data for personnels in a workflow', function (done) {

    var req = {params: {id: 2}};

    api.manageWorkflow(req, res, function () {
      expect(res.json.mostRecentCall.args[0].personnelData.length).toBe(2);
      expect(res.json.mostRecentCall.args[0].jobDescription.personnels.length).toBe(2);
      expect(res.json.mostRecentCall.args[0].jobDescription.personnels[0].name)
        .toEqual(expectedWorkflowPersonnel.name);
      expect(res.json.mostRecentCall.args[0].jobDescription.personnels[0].surname)
        .toEqual(expectedWorkflowPersonnel.surname);
      expect(res.json.mostRecentCall.args[0].jobDescription.position).toEqual('Company 3');
      expect(res.json.mostRecentCall.args[0].jobDescription.personnels[0].workflows[0].comments)
        .toEqual('hi there');
      expect(res.json.mostRecentCall.args[0].personnelData[0].contactDetails).toEqual({ mobile : '12345678', home : '2349894', email : undefined });
      expect(res.json.mostRecentCall.args[0].personnelData[0].commLog.length).toEqual(5);
      expect(_.pluck(res.json.mostRecentCall.args[0].personnelData[0].commLog, '_id')).toEqual([1,2,3,4,5]);
      expect(res.json.mostRecentCall.args[0].personnelData[0].followup.length).toEqual(5);
      done();
    });

  });

});



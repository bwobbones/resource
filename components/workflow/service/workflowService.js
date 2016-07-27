/* globals appServices */
'use strict';

appServices.factory('WorkflowService', function() {

  var workflowService = {

    loadStates: function(scope) {
     
      return [
        {
          index: 0,
          state: 'Considered',
          title: 'Considered for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/considered.jade'
        },
        {
          index: 1,
          state: 'Available',
          title: 'Availability check for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/available.jade'
        },
        {
          index: 2,
          state: 'Format CV',
          title: 'Format CV check for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/formatcv.jade'
        },
        {
          index: 3,
          state: 'Submission',
          title: 'Submission of CV for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/submission.jade'
        },
        {
          index: 4,
          state: 'Interview Request',
          title: 'Interview request for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/interviewRequest.jade'
        },
        {
          index: 5,
          state: 'Quality Check',
          title: 'Quality check for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/quality.jade'
        },
        {
          index: 6,
          state: 'Interview',
          title: 'Interview for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/interview.jade'
        },
        {
          index: 7,
          state: 'Pre-Employment Requirement',
          title: 'Pre-Employment requirements for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/preEmployment.jade'
        },
        {
          index: 8,
          state: 'Hired',
          title: 'Hired for {{ jobDescription.position }} with {{ jobDescription.company }}',
          template: 'partials/workflow/hired.jade'
        }
    ];      

    }

  };

  return workflowService;

});

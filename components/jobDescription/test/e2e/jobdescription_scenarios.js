/* globals login, createJobDescription, deleteJobDescription, logout, input, sleep, moment, appElement */
'use strict';

describe('Resource', function() {

  describe('Job Descriptions', function() {
 
    // beforeEach(function() {
    //   browser().navigateTo('/');
    //   login();
    //   createJobDescription('testcompany', 'testposition');
    // });
    
    // afterEach(function() {
    //   deleteJobDescription('testposition');
    //   logout();
    // });
    
    // create
    // it('should create a job description and find them in the search list', function() {
    //   expect(element('.jobDescriptionList').text()).toContain('testposition');
    // });
    
    // validate
    it('should not be possible to remove the company or position fields from a job description', function() {
      element('a[href$="addJobDescription"]').click();
      element('*:contains("testposition")').click();
      
      // clear the position and check that there is failure on save      
      input('form.position').enter('');
      element('#editJobDescriptionButton').click();
      expect(element('.text-danger').text()).toContain('This field is required');
      expect(repeater('.text-danger:visible').count()).toBe(1);
      input('form.position').enter('testposition');
      expect(repeater('.text-danger:visible').count()).toBe(0);
      
      // clear the company and check that there is failure on save
      input('form.company').enter('');
      element('#editJobDescriptionButton').click();
      expect(element('.text-danger').text()).toContain('This field is required');
      expect(repeater('.text-danger:visible').count()).toBe(1);
      input('form.company').enter('testcompany');
      expect(repeater('.text-danger:visible').count()).toBe(0);
    });
    
    // validate
    describe('Mandatory Fields', function() {

      afterEach(function() {
        deleteJobDescription('missing mandatory');
      });

      it('should not save job description with missing mandatory fields', function() {

        element('a[href$="addJobDescription"]').click();
        input('form.company').enter('missing mandatory');
        element('#addJobDescriptionButton').click();

        expect(element('.jobDescriptionList').text()).not().toContain('missing mandatory');

        input('form.position').enter('missing mandatory');
        element('#addJobDescriptionButton').click();

        expect(element('.jobDescriptionList').text()).toContain('missing mandatory');
        
      });

    });
    
    // create
    // it('should edit a job description and update the search list', function() {
    //   element('a[href$="addJobDescription"]').click();
    //   element('*:contains("testposition")').click();
    //   input('form.position').enter('testposition-updated');
    //   element('#editJobDescriptionButton').click();
    //   expect(element('.jobDescriptionList').text()).toContain('testposition-updated');
    // });
    
    // delete
    it('should cancel the deletion of a personnel', function() {
      element('a[href$="addJobDescription"]').click();
      element('*:contains("testposition")').click();
      element('#deleteJobDescriptionButton').click();
      element('.cancelDeleteJobDescription').click();
      expect(element('.jobDescriptionList').text()).toContain('testposition');
    });
    
    // delete
    it('should delete a job description', function() {
      // dummy created because the .jobDescriptionList doesn't exist if there's nothing in it
      createJobDescription('dummycomp', 'dummypos');
      
      // here is the delete test
      expect(element('.jobDescriptionList').text()).toContain('dummypos');
      element('*:contains("dummypos")').click();
      element('#deleteJobDescriptionButton').click();
      element('.okDeleteJobDescription').click();
      expect(element('.jobDescriptionList').text()).not().toContain('dummypos');

    });
    
    // validate
    it('should not allow saving when there are validation errors', function() {

      // don't fill in any fields
      element('a[href$="addJobDescription"]').click();
      element('#addJobDescriptionButton').click();
      // the Add button should still be there
      expect(element('#addJobDescriptionButton').text()).toBe('Add');
      
      // only fill the company
      input('form.company').enter('dummycomp');
      element('#addJobDescriptionButton').click();
      expect(element('#addJobDescriptionButton').text()).toBe('Add');
      input('form.company').enter('');
      
      // only fill the position
      input('form.position').enter('dummypos');
      element('#addJobDescriptionButton').click();
      expect(element('#addJobDescriptionButton').text()).toBe('Add');
      input('form.position').enter('');
      
    });
    
    // create
    // it('should fill an entire job description with data that is retrievable', function() {
    //   element('a[href$="addJobDescription"]').click();
    //   input('form.company').enter('company');
    //   input('form.position').enter('fulldatatest');
    //   input('form.positionnumber').enter('positionnumber');
    //   element('button[name="parttime"]').click();
    //   input('form.department').enter('department');
    //   input('form.replacement').check();
    //   input('form.datecompleted').enter(moment().endOf('month').format('DD/M/YYYY'));
    //   appElement('#dateCompletedField', function(elm) {
    //     elm.trigger('blur');//or keypress
    //   });
    //   input('form.worklocation').enter('worklocation');
    //   //input('form.daterequired').enter('29/9/2013');
    //   input('form.reportingto').enter('reportingto');
    //   input('form.reportingname').enter('reportingname');
    //   //input('form.expectedstart').enter('29/9/2013');
    //   input('form.expat').check();
    //   element('#addJobDescriptionButton').click();
      
    //   // make sure that we've transitioned to edit state
    //   expect(element('#editJobDescriptionButton').text()).toBe('Save');
      
    //   // go back to the home page and load
    //   browser().navigateTo('/');
    //   element('a[href$="addJobDescription"]').click();
    //   element('*:contains("fulldatatest")').click();
      
    //   // expect the data to be in all fields
    //   expect(input('form.company').val()).toBe('company');
    //   expect(input('form.position').val()).toBe('fulldatatest');
    //   expect(input('form.positionnumber').val()).toBe('positionnumber');
    //   expect(element('button.active').text()).toContain('Part Time');
    //   expect(input('form.department').val()).toBe('department');
    //   expect(input('form.replacement').val()).toBe('on');
    //   expect(input('form.datecompleted').val()).toBe(moment().endOf('month').format('DD/M/YYYY'));
    //   expect(input('form.worklocation').val()).toBe('worklocation');
    //   // does not work with ui-date
    //   //expect(input('form.daterequired').val()).toBe('29/9/2013');
    //   expect(input('form.reportingto').val()).toBe('reportingto');
    //   expect(input('form.reportingname').val()).toBe('reportingname');
    //   // does not work with ui-date
    //   //expect(input('form.expectedstart').val()).toBe('29/9/2013');
    //   expect(input('form.expat').val()).toBe('on');
      
    //   // delete the full data guy
    //   deleteJobDescription('fulldatatest');
    //   expect(element('.jobDescriptionList').text()).not().toContain('fulldatatest');
      
    // });
    
    // create
    it('should only show companies in the typeahead', function() {
      
      // add a new company
      element('a[href$="addJobDescription"]').click();
      expect(element('.jobDescriptionList').val()).toBeDefined();
      input('form.company').enter('typeahead-company-1');
      input('form.position').enter('typeahead-position-1');
      element('#addJobDescriptionButton').click();
      
      // enter the first letter of the company in the company field
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('ty');
      expect(element('.dropdown-menu').text()).toContain('typeahead-company-1');
  
      // select the company from the list
      element('a:contains("typeahead-company-1")').click();  
      expect(input('form.company').val()).toBe('typeahead-company-1');
      
      // delete the company
      element('*:contains("typeahead-position-1")').click();
      element('#deleteJobDescriptionButton').click();
      element('.okDeleteJobDescription').click();
      expect(element('.jobDescriptionList').text()).not().toContain('typeahead-position-1');
    });
    
    // create
    it('should only show positions that are available in the company in the typeahead', function() {
      
      // create two companies each with 2 positions
      element('a[href$="addJobDescription"]').click();
      expect(element('.jobDescriptionList').val()).toBeDefined();
      input('form.company').enter('typeahead-company-1');
      input('form.position').enter('typeahead-position-1-1');
      element('#addJobDescriptionButton').click();
      
      element('a[href$="addJobDescription"]').click();
      expect(element('.jobDescriptionList').val()).toBeDefined();
      input('form.company').enter('typeahead-company-1');
      input('form.position').enter('typeahead-position-1-2');
      element('#addJobDescriptionButton').click();
      
      element('a[href$="addJobDescription"]').click();
      expect(element('.jobDescriptionList').val()).toBeDefined();
      input('form.company').enter('typeahead-company-2');
      input('form.position').enter('typeahead-position-2-1');
      element('#addJobDescriptionButton').click();
      
      element('a[href$="addJobDescription"]').click();
      expect(element('.jobDescriptionList').val()).toBeDefined();
      input('form.company').enter('typeahead-company-2');
      input('form.position').enter('typeahead-position-2-2');
      element('#addJobDescriptionButton').click();
      
      // select one company, verify that only it's positions are available
      element('a[href$="addJobDescription"]').click();
      input('form.company').enter('ty');
      element('a:contains("typeahead-company-1")').click();
      expect(input('form.company').val()).toBe('typeahead-company-1');
      input('form.position').enter('ty');
      sleep(1);
      expect(element('.dropdown-menu').text()).toContain('typeahead-position-1-1');
      expect(element('.dropdown-menu').text()).toContain('typeahead-position-1-2');
      expect(element('.dropdown-menu').text()).not().toContain('typeahead-position-2-1');
    
      // delete all
      deleteJobDescription('typeahead-position-1-1');
      deleteJobDescription('typeahead-position-1-2');
      deleteJobDescription('typeahead-position-2-1');
      deleteJobDescription('typeahead-position-2-2');
      
    });


    // create
    it('should use typeaheads from personnel roles for the project', function() {

      // type in the project field
      element('a[href$="addJobDescription"]').click();
      input('form.project').enter('mi');
      
      expect(element('.dropdown-menu').text()).toContain('Mine');
    });

    describe('Closing', function() {

      beforeEach(function() {
        createJobDescription('closing company', 'closing company');
      });

      afterEach(function() {
        deleteJobDescription('closing company');
      });

      it('should close a job description', function() {

        expect(element('.jobDescriptionList').text()).toContain('closing company');

        element('button[name="closed"]').click();
        expect(element('button.active').text()).toContain('Closed');
        element('#editJobDescriptionButton').click();
        expect(element('.jobDescriptionList').text()).not().toContain('closing company'); 

        element('label[name="showclosed"]').click();
        expect(element('.jobDescriptionList').text()).toContain('closing company'); 

      });

    });
    
  });
});

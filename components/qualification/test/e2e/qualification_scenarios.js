describe('MinHR', function() {
  
 describe('Qualifications', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });
    
    afterEach(function() {
      deletePersonnel('testname');
      logout();
    });
    
    it('should show and clear the qualifications modal', function() {
      element('*:contains("testname")').click();
      element('#addQualificationButton').click();
      expect(element('.okQualificationDone').text()).toContain('Ok');
    });

    it('should be possible to add a qualification', function() {

      addQualification("qualificationname");
      var getCount = repeater('#qualTable tr').count();
      expect(getCount).toEqual(3);

    });

    it('should be possible to add two qualifications', function() {

      addQualification("qualificationname");
      var getCount = repeater('#qualTable tr').count();
      expect(getCount).toEqual(3);

      addQualification("qualificationname2");
      getCount = repeater('#qualTable tr').count();
      expect(getCount).toEqual(4);

    });

    it('should delete a qualification from a personnel', function() {

      addQualification("qualificationname");
      var getCount = repeater('#qualTable tr:visible').count();
      expect(getCount).toEqual(2);

      // delete it
      element('#deleteQualificationMessageBox-qualificationname').click();
      expect(element('#deleteQualificationButton').text()).toContain("Ok");
      element('#deleteQualificationButton').click();
      getCount = repeater('#qualTable tr:visible').count();
      expect(getCount).toEqual(0);

      // check that the link is there
      expect(element('#noQualifications:visible').text()).toContain("No qualifications have been entered");

    });

    it('should be possible to edit a qualification', function() {

      addQualification("qualificationname");
      var getCount = repeater('#qualTable tr').count();
      expect(getCount).toEqual(3);

      // edit the qualification
      element("#qualificationName-qualificationname").click();
      input('qualification.name').enter('qualificationname-edited');
      element('.okQualificationDone').click();
      expect(getCount).toEqual(3);
      
      expect(element('#qualificationName-qualificationname-edited:visible').text()).toContain("qualificationname-edited");
    });

    it('should be possible to edit qualification and not set the expiry date', function() {

      browser().navigateTo('/');
      element('*:contains(", testname")').click();
      addQualification("qualificationname", false);
      element("#qualificationName-qualificationname").click();

      expect(input("qualification.expiryDate").val()).toBe("");

    });

    it('should be possible to add and then edit an expiry date', function() {

      // add a new qualification to testname
      browser().navigateTo('/');
      element('*:contains(", testname")').click();
      addQualification("qualificationname", true);

      // open for editing
      element("#qualificationName-qualificationname").click();
      expect(input("qualification.expiryDate").val()).toMatch(/\d*\/\d*\/\d\d\d\d/);
      element('.okQualificationDone').click();

      // and do it again
      element("#qualificationName-qualificationname").click();
      expect(input("qualification.expiryDate").val()).toMatch(/\d*\/\d*\/\d\d\d\d/);
      element('.okQualificationDone').click();

    });

    it('should be possible to add and delete qualifications at will', function() {

      // add a qual
      addQualification("qualificationname");
      var getCount = repeater('#qualTable tr:visible').count();
      expect(getCount).toEqual(2);

      // delete a qual
      element('#deleteQualificationMessageBox-qualificationname').click();
      expect(element('#deleteQualificationButton').text()).toContain("Ok");
      element('#deleteQualificationButton').click();
      getCount = repeater('#qualTable tr:visible').count();
      expect(getCount).toEqual(0);

      // add a another one
      addQualification("qualificationname2");
      getCount = repeater('#qualTable tr:visible').count();
      expect(getCount).toEqual(2);

    });

    it('should be show typeaheads for the qualification field', function() {

      addFullQualification();
      
      element('#editPersonnelButton').click();

      element('#addQualificationButton').click();

      input('qualification.name').enter('qual');
      expect(element('.dropdown-menu').text()).toContain('qualificationName');

    });   

    it('should allow creating new qualifications from the dialog', function() {

      addFullQualification();

      element('#editPersonnelButton').click();

      element("#qualificationName-qualificationName").click();
      element(".saveAndNewButton").click();

      expect(input('qualification.name').val()).toBe('');

      input('qualification.name').enter('secondqual');
      element('.okQualificationDone').click();

      expect(element('#qualificationName-qualificationName:visible').text()).toContain("qualificationName");
      expect(element('#qualificationName-secondqual:visible').text()).toContain("secondqual");
      var getCount = repeater('#qualTable tr').count();
      expect(getCount).toEqual(4);
    });  

  });
  
});

function addFullQualification() {
  element('#addQualificationButton').click();
  input('qualification.name').enter('qualificationName');
  input('qualification.certificateNumber').enter('1234567890');
  input('qualification.institution').enter('Edith Cowan');
  element('.okQualificationDone').click();
  expect(element('#qualificationName-qualificationName:visible').text()).toContain('qualificationName');
}

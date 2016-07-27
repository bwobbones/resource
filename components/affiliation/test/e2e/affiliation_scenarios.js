describe('MinHR', function() {

  describe('affiliations', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });
    
    afterEach(function() {
      deletePersonnel('testname');
      logout();
    });
    
    it('should show and clear the affiliations modal', function() {
      element('*:contains("testname")').click();
      element('#addAffiliationButton').click();
      expect(element('.okAffiliationDone').text()).toContain('Ok');
    });

    it('should be possible to add a affiliation', function() {

      addAffiliation("affiliationname", "affiliationlevel");
      var getCount = repeater('#affiliationTable tr').count();
      expect(getCount).toEqual(2);

    });

    it('should be possible to add two affiliations', function() {

      addAffiliation("affiliationname", "affiliationlevel");
      var getCount = repeater('#affiliationTable tr').count();
      expect(getCount).toEqual(2);

      addAffiliation("affiliationname2");
      getCount = repeater('#affiliationTable tr').count();
      expect(getCount).toEqual(3);

    });

    it('should delete a affiliation from a personnel', function() {

      addAffiliation("affiliationname", "affiliationlevel");
      var getCount = repeater('#affiliationTable tr:visible').count();
      expect(getCount).toEqual(2);

      // delete it
      element('#deleteAffiliationMessageBox-affiliationname').click();
      expect(element('#deleteAffiliationButton').text()).toContain("Ok");
      element('#deleteAffiliationButton').click();
      getCount = repeater('#affiliationTable tr:visible').count();
      expect(getCount).toEqual(0);

      // check that the link is there
      expect(element('#noAffiliations:visible').text()).toContain("No affiliations have been entered");

    });

    it('should be possible to edit a affiliation', function() {

      addAffiliation("affiliationname", "affiliationlevel");
      var getCount = repeater('#affiliationTable tr').count();
      expect(getCount).toEqual(2);

      // edit the role
      element("#affiliationName-affiliationname").click();
      input('affiliation.name').enter('affiliationname-edited');
      element('.okAffiliationDone').click();
      expect(getCount).toEqual(2);
      
      expect(element('#affiliationName-affiliationname-edited:visible').text()).toContain("affiliationname-edited");
    });

    it('should be possible to add and delete affiliations at will', function() {

      // add a qual
      addAffiliation("affiliationname", "affiliationlevel");
      var getCount = repeater('#affiliationTable tr:visible').count();
      expect(getCount).toEqual(2);

      // delete a qual
      element('#deleteAffiliationMessageBox-affiliationname').click();
      expect(element('#deleteAffiliationButton').text()).toContain("Ok");
      element('#deleteAffiliationButton').click();
      getCount = repeater('#affiliationTable tr:visible').count();
      expect(getCount).toEqual(0);

      // add a another one
      addAffiliation("affiliationname2");
      getCount = repeater('#affiliationTable tr:visible').count();
      expect(getCount).toEqual(2);

    });

    it('should allow creating new affiliations from the dialog', function() {

      addAffiliation("affiliation", 2);

      element('#editPersonnelButton').click();

      element("#affiliationName-affiliation").click();
      element(".saveAndNewButton").click();

      expect(input('affiliation.name').val()).toBe('');

      input('affiliation.name').enter('secondaffiliation');
      element('.okAffiliationDone').click();

      expect(element('#affiliationName-affiliation:visible').text()).toContain("affiliation");
      expect(element('#affiliationName-secondaffiliation:visible').text()).toContain("secondaffiliation");
      var getCount = repeater('#affiliationTable tr').count();
      expect(getCount).toEqual(3);
    });
    
  });
  
});

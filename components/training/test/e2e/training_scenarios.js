describe('MinHR', function() {
  
  describe('Training', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
      login();
      createPersonnel('testname');
    });
    
    afterEach(function() {
      deletePersonnel('testname');
      logout(); 
    });
    
    it('should show and clear the trainings modal', function() {
      element('*:contains("testname")').click();
      element('#addTrainingButton').click();
      expect(element('.okTrainingDone').text()).toContain('Ok');
    });

    it('should be possible to add a training', function() {

      addTraining("trainingname");
      var getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(2);

    });

    it('should be possible to add two trainings', function() {

      addTraining("trainingname");
      var getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(2);

      addTraining("trainingname2");
      getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(3);

    });

    it('should delete a training from a personnel', function() {

      addTraining("trainingname");
      var getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(2);

      // delete it
      element('#deleteTrainingMessageBox-trainingname').click();
      expect(element('#deleteTrainingButton').text()).toContain("Ok");
      element('#deleteTrainingButton').click();
      getCount = repeater('#trainingTable tr:visible').count();
      expect(getCount).toEqual(0);

      // check that the link is there
      expect(element('#noTrainings:visible').text()).toContain("No training has been entered");

    });

    it('should be possible to edit a training', function() {

      addTraining("trainingname");
      var getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(2);

      // edit the role
      element("#trainingName-trainingname").click();
      input('training.name').enter('trainingname-edited');
      element('.okTrainingDone').click();
      expect(getCount).toEqual(2);
      
      expect(element('#trainingName-trainingname-edited:visible').text()).toContain("trainingname-edited");
    });

    it('should be possible to edit training and not set a date obtained', function() {

      browser().navigateTo('/');
      element('*:contains(", testname")').click();
      addTraining("trainingname", false);
      element("#trainingName-trainingname").click();

      expect(input("training.dateObtained").val()).toBe("");

    });

    it('should be possible to add and delete training at will', function() {

      // add a qual
      addTraining("trainingname");
      var getCount = repeater('#trainingTable tr:visible').count();
      expect(getCount).toEqual(2);

      // delete a qual
      element('#deleteTrainingMessageBox-trainingname').click();
      expect(element('#deleteTrainingButton').text()).toContain("Ok");
      element('#deleteTrainingButton').click();
      getCount = repeater('#trainingTable tr:visible').count();
      expect(getCount).toEqual(0);

      // add a another one
      addTraining("trainingname2");
      getCount = repeater('#trainingTable tr:visible').count();
      expect(getCount).toEqual(2);

    });

    it('should show training data in typeaheads', function() {
      // add a role
      addFullTraining();

      // save the role
      element('#editPersonnelButton').click();

      element('#addTrainingButton').click();

      input('training.name').enter('tra');
      expect(element('.dropdown-menu').text()).toContain('trainingname');
      element('.dropdown-menu').click();
      input('training.institution').enter('ins');
      expect(element('.dropdown-menu').text()).toContain('institution');
      element('.dropdown-menu').click();
    });

    it('should allow creating new training from the dialog', function() {

      addFullTraining();

      element('#editPersonnelButton').click();

      element("#trainingName-trainingname").click();
      element(".saveAndNewButton").click();

      expect(input('training.name').val()).toBe('');

      input('training.name').enter('secondtraining');
      element('.okTrainingDone').click();

      expect(element('#trainingName-trainingname:visible').text()).toContain("trainingname");
      expect(element('#trainingName-secondtraining:visible').text()).toContain("secondtraining");
      var getCount = repeater('#trainingTable tr').count();
      expect(getCount).toEqual(3);
    });

  });

});

function addFullTraining() {
  element('#addTrainingButton').click();
  input('training.name').enter('trainingname');
  selectDate('#dateObtainedPicker');
  element('#trainingAccordion').click();
  input('training.certificateNumber').enter('2345678');
  input('training.institution').enter('institution');
  element('.okTrainingDone').click();
  expect(element('#trainingName-trainingname:visible').text()).toContain('trainingname');
}

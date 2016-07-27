appServices.factory("DateValidationService", function() {
  var dateValidationService = {

    validate: function(date) {

      if (!date) {
        return true;
      }

      var dateMoment = moment(date, ['D/M/YYYY', 'MMM YYYY', 'MMMM YYYY'], true);
      return dateMoment.isValid();
    }

  };
  return dateValidationService;
});
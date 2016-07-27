appServices.factory("CommLogService", function($http, HtmlifyDataService, PersonnelService, AlertService) {

  var commLogService = {

    addToPersonnel: function(scope, personnel, commLog, form) {

      commLog._id = commLog._id || new ObjectId();
      personnel.commLog = personnel.commLog || [];

      // from job description, there is no pForm, just set it to $valid
      if (!form) {
        form = {};
        form.$valid = true;
      }

      if (!commLog.dateEntered) {
        commLog.dateEntered = new moment().format('DD/MM/YYYY HH:mm');
      }
      personnel.commLog.push(commLog);
      HtmlifyDataService.htmlify(personnel.commLog);
      PersonnelService.save(scope, personnel, form);
      AlertService.add("success", "Log added");

    }

  };

  return commLogService;
});
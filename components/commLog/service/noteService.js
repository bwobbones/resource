appServices.factory("NoteService", function($http, HtmlifyDataService, PersonnelService, AlertService) {

  var noteService = {

    addToPersonnel: function(scope, personnel, note, form) {

      note._id = note._id || new ObjectId();
      personnel.notes = personnel.notes || [];

      // from job description, there is no pForm, just set it to $valid
      if (!form) {
        form = {};
        form.$valid = true;
      }

      if (!note.dateEntered) {
        note.dateEntered = new moment().format('DD/MM/YYYY HH:mm');
      }
      personnel.notes.push(note);
      HtmlifyDataService.htmlify(personnel.notes);
      PersonnelService.save(scope, personnel, form);
      AlertService.add("success", "Log added");

    }

  };

  return noteService;
});

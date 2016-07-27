appServices.factory("FollowupService", function($window, PersonnelService) {

	var followupService = {

    addFollowup: function(followup) {

      // load the personnel
      PersonnelService.find(followup.personnelId).then(function(httpResult) {

        var personnel = httpResult.data;

        // make sure the commlog collection exists
        if (!personnel.commLog) {
          personnel.commLog = [];
        }

        // make a parent commlog (if one hasn't been provided)
        if (!followup.commlog) {
          commlog = {
            _id: new ObjectId(),
            dateEntered: new moment().format('DD/MM/YYYY HH:mm'),
            contact: followup.contact,
            message: personnel.name + ' ' + personnel.surname + ' has changed'
          };
          personnel.commLog.push(commlog);
        }

        // create the followup collection (if one doesn't exist)
        if (!commlog.followup) {
          commlog.followup = [];
        }

        // make the followup and add it to the commlog followup collection

        commlog.followup.push( {
          dateDue: followup.time,
          completed: false,
          contact: followup.contact,
          message: followup.message,
          type: followup.type
        });

        PersonnelService.save(followup.scope, personnel, {$valid: true});

      });

    },

    updateFollowup: function(personnelId, followupId, updatedFollowup) {

      // TODO: urghh On2!
      PersonnelService.find(personnelId).then(function(httpResult) {
        _.each(httpResult.data.commLog, function(commLog) {
          _.each(commLog.followup, function(followup) {
            if (_.isEqual(followup._id, followupId)) {
              _.merge(followup, updatedFollowup);
            }
          })
        });

        PersonnelService.save(undefined, httpResult.data, {$valid: true});

      });
    }

	}; 

  return followupService;

});

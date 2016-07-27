appServices.factory('HtmlifyDataService', function() {
  
  // at the moment only commlogs - need to generify

  var htmlifyDataService = {
    htmlify: function(data) {
      if (data) {
        _.each(data, function(commLog) {
          if (commLog.message) {
            commLog.message = commLog.message.replace(/[\n\r]/g, '<br/>');
          }
        });
      }
    }
  };

  return htmlifyDataService;
});
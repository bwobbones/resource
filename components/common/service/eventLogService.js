appServices.factory('EventLogService', function($http) {
  
  var logService = {
    log: function(type, username, message, changedData) {
      var log = {
        type: type,
        username: username,
        message: message,
        changedData: changedData
      };
      
      $http.post('/api/logEvent', log);
    }
  };

  return logService;
});
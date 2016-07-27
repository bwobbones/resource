appServices.factory('UserService', function($http) {
  
  var userService = {
    getUsers: function(type, username, message, changedData) {

      var promise = $http.get('/api/users').then(function(res, status, headers, config) {
        var users = [];
        _.each(res.data.users, function(user) {
          users.push(user);
        });
        return users;
      });
      return promise;
    }
  };

  return userService;
});
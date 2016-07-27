appServices.factory("GoogleLocationService", function($http, $q) {
  var googleLocationService = {
    query: function(searchText) {

      var searchParams = {
        address: searchText,
        sensor: false
      };

      var promise = $http.get('http://maps.googleapis.com/maps/api/geocode/json?region=au', {
        params: searchParams
      }).then(function(data, status, headers, config) {
        return data;
      });
      return promise;
    },

    findAddresses: function(searchText, useRegion) {
      var promise = this.query(searchText, false).then(function (result) {
        var addresses = [];

        if (result && result.data.results) {
          _.each(result.data.results, function(item) {
            addresses.push({
              name: item.formatted_address,
              location: item.geometry.location
            });
          });
        }
        return addresses;
      });
      return promise;
    },

    findStateAndCountry: function(address, location) {
      if (!location) {
        return $q(function(resolve) {
          resolve(address ? address : '');
        });
      } else {
        return extractStateAndCountry(location);
      }
    }

  };

  function extractStateAndCountry(location) {

    var promise = $http.get(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      location.lat + ',' +
      location.lng +
      '&key=AIzaSyAuzmQaHMOTdUFvgofNc-6SBQgWbXricUE', {}).then(function (data) {

        var googleResult = data.data.results[0];

        var state = _.find(googleResult.address_components, function(result) {
          return _.includes(result.types, 'administrative_area_level_1')
            && _.includes(result.types, 'political');
        });

        var country = _.find(googleResult.address_components, function(result) {
          return _.includes(result.types, 'country')
            && _.includes(result.types, 'political');
        });

        return state.short_name + ', ' + country.long_name;
      });

    return promise;
  }

  return googleLocationService;
});
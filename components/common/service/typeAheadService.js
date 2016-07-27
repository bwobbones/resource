appServices.factory("TypeAheadService", function($http, $rootScope) {
  var typeAheadService = {
    query: function(field, value) {
    	return $http.get('/api/typeAheadFieldData', {params: {fieldName: field, searchKey: value}}).then(function(res) {
	        var fields = [];
	        _.each(res.data.typeAheadData, function(field){
	          fields.push(field);
	        });
	        return fields;
	      });
    }
  };
  return typeAheadService;
});
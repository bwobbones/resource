appServices.factory('SearchService', function($http, $q, RoleService, _) {
  
  var searchFields = [];
  searchFields.push(
    {
      searchType: 'personnel',
      type: 'Surname',
      searchKey: 'personnelName',
      shortcut: 's'
    },
    {
      searchType: 'personnel',
      type: 'Similar Position',
      searchKey: 'similarPosition',
      shortcut: 'p'
    },
    {
      searchType: 'personnel',
      type: 'Keyword',
      searchKey: 'keywords',
      shortcut: 'k'
    },
    {
      searchType: 'personnel',
      type: 'Occupation',
      searchKey: 'occupation',
      shortcut: 'o'
    },
    {
      searchType: 'personnel',
      type: 'Qualification',
      searchKey: 'qualifications',
      searchArrayKey: 'name',
      shortcut: 'q'
    },
    {
      searchType: 'job',
      type: 'Job',
      searchKey: 'job',
      shortcut: 'j'
    }
  );
  
  var searchService = {
    
    searchFields: function() {
      return searchFields;
    },
    
    personnelSearch: function(personnelQuery) {
      
      var queryTerms = {};
      
      _.each(personnelQuery, function(query) {
        
        if (query.searchArrayKey) {
          addArraySearchTerm(query, queryTerms);
        } else {
          queryTerms[query.searchKey] = query.searchTerm;
        }
      });
      
      return $http.post('/api/searchPersonnel', queryTerms).then(function(matchingPersonnels) {
          
        _.each(matchingPersonnels.data.personnels, function(personnel) {
          personnel.currentRole = RoleService.latestRole(personnel);
        });
        
        return matchingPersonnels.data.personnels;
      });
    },
    
    jobSearch: function(jobQuery) {
      
      return $http.get('/api/jobDescriptions', {params: {searchKey: jobQuery}}).then(function(jobs) {
        return jobs.data.jobDescriptions;
      });

    }
    
  };
  return searchService;
  
  function addArraySearchTerm(query, queryTerms) {
    var obj = {};
    
    if (!queryTerms[query.searchKey]) {
      queryTerms[query.searchKey] = [];
    }
    
    obj[query.searchArrayKey] = query.searchTerm;
    queryTerms[query.searchKey].push(obj);
  }
  
});
angularModules.config(function($stateProvider) {
  $stateProvider.state('index', {
    url: '/',
    views: {
      "dataPanel": {
        templateUrl: "partials/index/index",
        controller: IndexCtrl
      }
    }
  });
});

angularModules.controller('IndexCtrl', ['$aside', '$scope', '$rootScope', '$state', 'localStorageService', 'IndexService', 
  'RoleService', 'SearchService', 'SliderService', IndexCtrl]);

function IndexCtrl($aside, $scope, $rootScope, $state, localStorageService, IndexService, RoleService, SearchService, SliderService) {

  $scope.form = {};

  $scope.matchingPersonnel = [];
  $scope.displayedPersonnel = [].concat($scope.matchingPersonnel);
  
  $scope.matchingJobs = [];
  $scope.displayedJobs = [].concat($scope.matchingJobs);
  
  $scope.personnelQuery = [];
  $scope.jobQuery = '';
  $scope.archivedSearches = {};
  
  $scope.newJobDescription = {};
  
  $scope.searchTypeAhead = SearchService.searchFields(); 
  
  $scope.$watch('form.searchTerms', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.enteredSearchTerms = _.clone($scope.form.searchTerms);
    }
  });
  
  $scope.$on('loadPreviousQuery', function(event, searchType, queries) {
    $scope.searchType = searchType;
    if (searchType === 'personnel') {
      $scope.jobQuery = '';
      $scope.personnelQuery = queries.lastPersonnelQuery;
      SearchService.personnelSearch($scope.personnelQuery).then(function(personnelResults) {
        $scope.matchingPersonnel = personnelResults;
        $scope.newJobDescription = personnelResults;
      });
    } else {
      $scope.personnelQuery = [];
      $scope.jobQuery = queries.lastJobQuery;
      SearchService.jobSearch($scope.jobQuery).then(function(jobResults) {
        $scope.matchingJobs = jobResults;
      });
    }
    
  });
  
  // when something is selected this is called
  $scope.updateQuery = function($item, $model, $label) {
    
    var regex = new RegExp('j\\s.*');
    
    if ($item.searchType === 'personnel' && !$scope.enteredSearchTerms.match(regex)) {
      $scope.jobQuery = '';
      $scope.searchType = 'personnel';
      addPersonnelQueryTerm($item, $model, $label);
      stashOtherSearches();
      SearchService.personnelSearch($scope.personnelQuery).then(function(personnelResults) {
        $scope.matchingPersonnel = personnelResults;
        $scope.newJobDescription = personnelResults;
      });
    } else if ($item.searchType === 'job' || $scope.enteredSearchTerms.match(regex)) {
      $scope.personnelQuery = [];
      $scope.searchType = 'job';
      $scope.jobQuery = resolveShortcuts($scope.enteredSearchTerms) || $scope.enteredSearchTerms;
      stashOtherSearches();
      SearchService.jobSearch($scope.jobQuery).then(function(jobResults) {
        $scope.matchingJobs = jobResults;
      });
    }
    $scope.form.searchTerms = undefined;
  }
  
  function addPersonnelQueryTerm($item, $model, $label) {

    var searchItem = resolveShortcuts($scope.enteredSearchTerms) || {
      searchType: $label,
      searchKey: $item.searchKey,
      searchTerm: $scope.enteredSearchTerms,
      searchArrayKey: $item.searchArrayKey,
      shortcut: $item.shortcut
    };
    
    var index = _.findIndex($scope.personnelQuery, { searchKey: $item.searchKey});
    
    // if its a multiple, always push it
    if (index === -1 || $item.searchArrayKey) {
      $scope.personnelQuery.push(searchItem);
    } else {
      $scope.personnelQuery[index] = searchItem;
    }
  }
  
  function stashOtherSearches() {
    if ($scope.searchType === 'personnel') {
      localStorageService.set('lastPersonnelQuery', _.clone($scope.personnelQuery));
    } else {
      localStorageService.set('lastJobQuery', _.clone($scope.jobQuery));
    }
    $scope.$emit('lastQueriesChanged');
  }
  
  function resolveShortcuts(searchTerm) {
    
    var shortcutList = _.pluck(SearchService.searchFields(), 'shortcut').join('');
    
    var regex = new RegExp('[' + shortcutList + ']\\s.*');
    if (searchTerm.match(regex)) {
      var shortcutCommands = searchTerm.split(' ');
      
      if (shortcutCommands[0] === 'j') {
        return shortcutCommands[1];
      }
      
      var searchItem = _.find(SearchService.searchFields(), { shortcut: shortcutCommands[0] }) || {};
      return {
        searchType: searchItem.type,
        searchKey: searchItem.searchKey,
        searchTerm: shortcutCommands[1],
        searchArrayKey: searchItem.searchArrayKey,
        shortcut: searchItem.shortcut
      };
    } else {
      return undefined;
    }
    
  }
  
  $scope.showAllPersonnel = function() {
    $scope.form.searchTerms = undefined;
    $scope.searchType = 'personnel';
    $scope.personnelQuery.push({
      searchType: 'personnel',
      searchKey: 'personnelName',
      searchTerm: '.*'
    })
    SearchService.personnelSearch($scope.personnelQuery).then(function(personnelResults) {
      $scope.matchingPersonnel = personnelResults;
      $scope.newJobDescription = personnelResults;
    });
  }

  $scope.clearSearch = function() {
    $scope.form.searchTerms = undefined;
    $scope.personnelQuery = [];
    $scope.jobQuery = '';
    SearchService.personnelSearch($scope.personnelQuery).then(function(personnelResults) {
      $scope.matchingPersonnel = personnelResults;
      $scope.newJobDescription = personnelResults;
    });
  }
  
  $scope.deleteSearchTerm = function(searchTerm) {
    _.remove($scope.personnelQuery, function(term) {
      return term.searchTerm === searchTerm.searchTerm;
    });
    SearchService.personnelSearch($scope.personnelQuery).then(function(personnelResults) {
      $scope.matchingPersonnel = personnelResults;
      $scope.newJobDescription = personnelResults;
    });
  }
  
  $scope.createJob = function() {
    $state.go('jobDescription.addJobDescription', {
      personnel: $scope.newJobDescription
    });
  }
  
  $scope.showPersonnelSlider = function() {
    SliderService.openSlider(
      'PersonnelSummaryCtrl',
      'partials/index/personnelSummary',
      {
        selectedPersonnel: function() {
          return $scope.selectedPersonnel = _.find($scope.matchingPersonnel, {
            isSelected: true
          });
        }
      });
    
  }
  
  $scope.showJobSlider = function() {
    SliderService.openSlider(
      'JobSummaryCtrl',
      'partials/index/jobSummary',
      {
        selectedJob: function() {
          return $scope.selectedJob = _.find($scope.matchingJobs, {
            isSelected: true
          });
        }
      }
    );
  }

}

describe("Index", function() {

  var rootScope;
  var indexCtrl;
  var scope;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $q, $rootScope, SearchService) {

    // create a dummy scope
    rootScope = $rootScope;
    scope = $rootScope.$new();
    
    spyOn(SearchService, 'personnelSearch').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({
        data: {
          _id: 1
        }
      });
      return deferred.promise;
    });

    // create the constructor
    indexCtrl = $controller(IndexCtrl, {
      $aside: {}, 
      $scope: scope, 
      $state: {}, 
      localStorageService: {
        set: function(value) {
          // noop
        }
      }, 
      IndexService: {}
    });

  }));

  afterEach(function() {});

  describe("IndexCtrl", function() {

    it('should only allow one personnel name search criteria', function() {
      
      var item1 = {
        searchKey: 'personnelName',
        searchType: 'personnel',
        searchTerm: 'item1'
      };
      
      var item2 = {
        searchKey: 'personnelName',
        searchType: 'personnel',
        searchTerm: 'item2'
      };
      
      var model = {};
      var label = 'personnel';
      
      scope.enteredSearchTerms = 'item1';
      scope.updateQuery(item1, model, label);
      scope.enteredSearchTerms = 'item2';
      scope.updateQuery(item2, model, label);
      
      expect(scope.personnelQuery.length).toBe(1);
    });

  });
  
  it('should replace an old personnel name search criteria with a new one', function() {
    var item1 = {
      searchKey: 'personnelName',
      searchType: 'personnel'
    };
    
    var item2 = {
      searchKey: 'personnelName',
      searchType: 'personnel'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery[0].searchTerm).toEqual('item2');
  });
  
  it('should only allow one keyword search criteria', function() {
      
    var item1 = {
      searchKey: 'keywords',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var item2 = {
      searchKey: 'keywords',
      searchType: 'personnel',
      searchTerm: 'item2'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery.length).toBe(1);
  });
  
  it('should replace an old keyword search criteria with a new one', function() {
    var item1 = {
      searchKey: 'keywords',
      searchType: 'personnel'
    };
    
    var item2 = {
      searchKey: 'keywords',
      searchType: 'personnel'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery[0].searchTerm).toEqual('item2');
  });
  
  it('should only allow one similar position search criteria', function() {
      
    var item1 = {
      searchKey: 'similarPosition',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var item2 = {
      searchKey: 'similarPosition',
      searchType: 'personnel',
      searchTerm: 'item2'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery.length).toBe(1);
  });
  
  it('should replace an old similar position search criteria with a new one', function() {
    var item1 = {
      searchKey: 'similarPosition',
      searchType: 'personnel'
    };
    
    var item2 = {
      searchKey: 'similarPosition',
      searchType: 'personnel'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery[0].searchTerm).toEqual('item2');
  });  
  
  it('should only allow one job search criteria', function() {
      
    var item1 = {
      searchKey: 'job',
      searchType: 'job',
      searchTerm: 'item1'
    };
    
    var item2 = {
      searchKey: 'job',
      searchType: 'job',
      searchTerm: 'item2'
    };
    
    var model = {};
    var label = 'job';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.jobQuery).toBe('item2');
  });
  
  it('should only allow many qualification criteria', function() {
    var item1 = {
      searchKey: 'qualifications',
      searchType: 'personnel',
      searchTerm: 'item1',
      searchArrayKey: 'name'
    };
    
    var item2 = {
      searchKey: 'qualifications',
      searchType: 'personnel',
      searchTerm: 'item2',
      searchArrayKey: 'name'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'item1';
    scope.updateQuery(item1, model, label);
    scope.enteredSearchTerms = 'item2';
    scope.updateQuery(item2, model, label);
    
    expect(scope.personnelQuery.length).toBe(2);
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    expect(scope.personnelQuery[1].searchTerm).toEqual('item2');
  });
  
  it('should be possible to use shortcut searches for surnames', function() {
    
    var item1 = {
      searchKey: 'personnelName',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 's item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchKey).toEqual('personnelName');
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    
  });
  
  it('should be possible to use shortcut searches for similar positions', function() {
    
    var item1 = {
      searchKey: 'similarPosition',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'p item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchKey).toEqual('similarPosition');
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    
  });   
  
  it('should be possible to use shortcut searches for keywords', function() {
    
    var item1 = {
      searchKey: 'keywords',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'k item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchKey).toEqual('keywords');
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    
  });   
  
  it('should be possible to use shortcut searches for occupations', function() {
    
    var item1 = {
      searchKey: 'occupation',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'o item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchKey).toEqual('occupation');
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    
  });  
  
  it('should be possible to use shortcut searches for qualifications', function() {
    
    var item1 = {
      searchKey: 'qualifications',
      searchType: 'personnel',
      searchTerm: 'item1',
      searchArrayKey: 'name',
      shortcut: 'q'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'q item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchKey).toEqual('qualifications');
    expect(scope.personnelQuery[0].searchTerm).toEqual('item1');
    
  });
  
  it('should be possible to use shortcut searches for jobs', function() {
    
    var item1 = {
      searchKey: 'job',
      searchType: 'job',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'job';
    
    scope.enteredSearchTerms = 'j item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.jobQuery).toEqual('item1');
    
  });
  
  it('should be possible to use shortcut searches for jobs, even when a personnel type is selected', function() {
    
    var item1 = {
      searchKey: 'surname',
      searchType: 'personnel',
      searchTerm: 'item1'
    };
    
    var model = {};
    var label = 'job';
    
    scope.enteredSearchTerms = 'j item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.jobQuery).toEqual('item1');
    
  });
  
  it('should be not resolve invalid shortcut queries', function() {
    
    var item1 = {
      searchKey: 'qualifications',
      searchType: 'personnel',
      searchTerm: 'item1',
      searchArrayKey: 'name',
      shortcut: 'q'
    };
    
    var model = {};
    var label = 'personnel';
    
    scope.enteredSearchTerms = 'x item1';
    scope.updateQuery(item1, model, label);
    
    expect(scope.personnelQuery[0].searchTerm).toEqual('x item1');
    
  });    

});
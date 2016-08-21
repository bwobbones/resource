'use strict';

describe('TabService', function() {

  var tabService;
  var rootScope;
  var scope;
  
  var setStorageSpy;
  var getStorageSpy;

  beforeEach(module('resource'));
  beforeEach(inject(function(TabService, localStorageService, $rootScope) {
    
    tabService = TabService;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    
    setStorageSpy = spyOn(localStorageService, 'set');
    getStorageSpy = spyOn(localStorageService, 'get').and.callFake(function() {
      return 1;
    });
    
  }));

  afterEach(function() {
  });

  it('should return the personnel tabs', function() {
    var personnelTabs = tabService.getTabs('personnelTabs');
    expect(personnelTabs.length).toEqual(6);
  });

  it('should return the job tabs', function() {
    var jobTabs = tabService.getTabs('jobTabs');
    expect(jobTabs.length).toEqual(6);
  });
  
  it('should remember the last selected tab', function() {
    var jobTabs = tabService.getTabs('jobTabs');
    jobTabs[1].active = true;
    tabService.rememberActive('jobTabs');
    expect(setStorageSpy).toHaveBeenCalledWith('jobTabs', 1);
  });
  
  it('should set the tab to remember', function() {
    tabService.setRemembered('jobTabs', 'Applicants');
    expect(setStorageSpy).toHaveBeenCalledWith('jobTabs', 4);
  });
 
  it('should open the remembered tab', function() {
    tabService.openRemembered('jobTabs');
    expect(tabService.getTabs('jobTabs')[1].active).toBeTruthy();
  });

});
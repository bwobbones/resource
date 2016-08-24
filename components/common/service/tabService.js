appServices.factory("TabService", function(localStorageService) {
  
  var jobTabs = [{
    name: 'Role Details',
    url: 'jobDescription/jobDescription_role'
  }, {
    name: 'Required Qualifications',
    url: 'jobDescription/jobDescription_qualifications'
  }, {
    name: 'Role Description',
    url: 'jobDescription/jobDescription_description'
  }, {
    name: 'Files',
    url: 'jobDescription/jobDescription_files'
  }, {
    name: 'Applicants',
    url: 'manageWorkflow/manageWorkflow'
  }, {
    name: 'Comments',
    url: 'jobDescription/jobDescription_comments'
  }];
  
  var personnelTabs = [{
    name: 'Personal Details',
    url: 'personnel_personal',
  }, {
    name: 'Contact Details',
    url: 'personnel_contact',
  }, {
    name: 'Skills',
    url: 'personnel_skills',
  }, {
    name: 'Experience',
    url: 'personnel_experience',
  }, {
    name: 'Files',
    url: 'personnel_docs',
  }, {
    name: 'Emergency Contact Details',
    url: 'personnel_emergency',
  }, {
    name: 'Notes',
    url: 'personnel_notes',
  }];
  
  var tabService = {
    
    // note here that the tabPane variable must be '$scope.tabPanes'
    registerTabWatcher: function(scope, tabSetName) {
      scope.$watch('tabPanes', function(tabs) {
        tabService.rememberActive(tabSetName);     
      }, true);
      
      scope.$on("$destroy", function() {
        localStorageService.remove(tabSetName);
      });
    },
    
    getTabs: function(tabSetName) {
      return tabSetName === 'jobTabs' ? jobTabs : personnelTabs;
    },
    
    openRemembered: function(tabSetName) {
      var savedTab = localStorageService.get(tabSetName);
      if (savedTab && savedTab !== -1) {
        tabService.getTabs(tabSetName)[savedTab].active = true;
      }
    },
    
    rememberActive: function(tabSetName) {
      var selectedTab = _.findIndex(tabService.getTabs(tabSetName), 'active');
      localStorageService.set(tabSetName, selectedTab);
    },
    
    setRemembered: function(tabSetName, tabName) {
      console.log()
      var selectedTab = _.findIndex(tabService.getTabs(tabSetName), 'name', tabName);
      localStorageService.set(tabSetName, selectedTab);
    }
    
  };
  return tabService;
});
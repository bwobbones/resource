'use strict';

var angularModules = angular.module('resource', [
  'ui.bootstrap',
  'ui.router',
  'ui.unique',
  'ui.keypress',
  'ui.validate',
  'resource.filters',
  'resource.services',
  'resource.directives',
  'ngAnimate',
  'toastr',
  'smart-table',
  'ngFileUpload',
  'uiGmapgoogle-maps',
  'ngSanitize',
  'cfp.hotkeys',
  'localytics.directives',
  'ui.select2',
  'ngAnimate',
  'fx.animations',
  'angular-loading-bar',
  'LocalStorageModule',
  'ui.bootstrap.datetimepicker',
  'ui.dateTimeInput',
  'ngAside',
  'angular-jwt'
]);

var minhrDirectives = angular.module('resource.directives', []);

var minhrFilters = angular.module('resource.filters', []);

var appServices = angular.module('resource.services', []);

angularModules.config(function ($httpProvider, $stateProvider, $controllerProvider, $urlRouterProvider, 
  $locationProvider, hotkeysProvider, jwtInterceptorProvider, toastrConfig) {
    
  $locationProvider.html5Mode(true);
  jwtInterceptorProvider.tokenGetter = ['config', 'localStorageService', function(config, localStorageService) {
    if (config.url.indexOf("maps.googleapis") !== -1) {
      return null;
    }
    return localStorageService.get('authToken');
  }];
  $httpProvider.interceptors.push('jwtInterceptor');

  $httpProvider.interceptors.push(function($q, $location) {

    return function(promise) {
      return promise.then(
        // Success: just return the response
        function(response){
          return response;
        },

        // Error: check the error status to get only the 401
        function(response) {
          if (response.status === 401) {
            $location.url('/loginUser');
          }
          return $q.reject(response);
        }
      );
    };
  });
  
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right',
    preventOpenDuplicates: true,
    timeOut: 2000
  });
  
});
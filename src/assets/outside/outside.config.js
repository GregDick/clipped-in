angular
  .module('clippedIn')
  .config(function($routeProvider, uiGmapGoogleMapApiProvider){

    $routeProvider
    .when('/outside', {
        templateUrl: 'assets/outside/outside.html',
        controller: 'OutsideCtrl',
        controllerAs: 'out'
      });

    uiGmapGoogleMapApiProvider
    .configure({
      key: 'AIzaSyAgMAo6VMQmdveEASKnK-Xgr5FMcYnHb8U',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  });

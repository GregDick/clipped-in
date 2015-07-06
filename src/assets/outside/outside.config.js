angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
    .when('/outside', {
      templateUrl: 'assets/outside/outside.html',
      controller: 'OutsideCtrl',
      controllerAs: 'out',
      private: true
    })
    .when('/trip/:id', {
      templateUrl: 'assets/outside/trip.html',
      controller: 'OutsideCtrl',
      controllerAs: 'out',
      private: true
    })
    .when('/plan', {
      templateUrl: 'assets/outside/plan.html',
      controller: 'OutsideCtrl',
      controllerAs: 'out'
    })
  });

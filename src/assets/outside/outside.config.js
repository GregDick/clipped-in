angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
    .when('/outside', {
        templateUrl: 'assets/outside/outside.html',
        controller: 'OutsideCtrl',
        controllerAs: 'out'
    })
    .when('/plan', {
        templateUrl: 'assets/outside/plan.html',
        controller: 'OutsideCtrl',
        controllerAs: 'out'
    })
  });

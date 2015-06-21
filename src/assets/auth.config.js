angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/login', {
        templateUrl: 'assets/login.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
  })

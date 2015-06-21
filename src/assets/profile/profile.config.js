angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/profile', {
        templateUrl: 'assets/profile/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
  })

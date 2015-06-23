angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/profile', {
        templateUrl: 'assets/profile/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .when('/', {
        templateUrl: 'assets/users/users.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
  });

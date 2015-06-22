angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/login', {
        templateUrl: 'assets/authorize/login.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth',
        resolve: {
          checkLogin: function ($rootScope, $location) {
            if ($rootScope.auth) {
              $location.path('/profile')
            }
          }
        }
      })
      .when('/logout', {
        template: '<h1>Logging out...</h1>',
        controller: 'LogoutCtrl',
        controllerAs: 'auth'
      })
  })

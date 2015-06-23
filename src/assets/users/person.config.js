angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/person/:id', {
        templateUrl: 'assets/profile/profile.html',
        controller: 'PersonCtrl',
        controllerAs: 'profile',
        private: true
      })
});

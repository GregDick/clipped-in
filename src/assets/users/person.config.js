angular
  .module('clippedIn')
  .config(function($routeProvider){
    $routeProvider
      .when('/person/:id', {
        templateUrl: 'assets/users/person.html',
        controller: 'PersonCtrl',
        controllerAs: 'profile',
        private: true
      })
});

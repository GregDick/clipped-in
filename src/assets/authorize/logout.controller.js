angular
  .module('clippedIn')
  .controller('LogoutCtrl', function(FB_URL, $scope, $rootScope, $location){
    var fb = new Firebase(FB_URL);

    fb.unauth(function () {
      $rootScope.auth = null;
      $location.path('/login');
    });



  });

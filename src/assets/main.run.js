angular
  .module('clippedIn')
  .run(function ($rootScope, $location, FB_URL) {
    $rootScope.$on('$routeChangeStart', function (event, nextRoute) {
      var fb = new Firebase(FB_URL);
      $rootScope.auth = fb.getAuth();

      if (nextRoute.$$route && nextRoute.$$route.private && !$rootScope.auth) {
        $location.path('/login')
      }
    });
  });

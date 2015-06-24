angular
  .module('clippedIn')
  .factory('Outside', function($http, IP_GEO_URL){
    return{
      getGeo(cb){
        $http
          .get(IP_GEO_URL)
          .success(cb)
      }
    }
  });

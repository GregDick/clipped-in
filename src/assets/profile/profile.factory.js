angular
  .module('clippedIn')
  .factory('Profile', function($http, FB_URL){
    return{
      create(personObject, userID, cb){
        $http
          .put(`${FB_URL}/profile/${userID}.json`, personObject)
          .success(cb)
      }
    }
  })

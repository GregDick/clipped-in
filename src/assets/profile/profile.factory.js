angular
  .module('clippedIn')
  .factory('Profile', function($http, FB_URL){
    return{
      create(personObject, userID, cb){
        $http
          .put(`${FB_URL}/profile/${userID}.json`, personObject)
          .success(cb)
      },

      getProfile(userID, cb){
        $http
          .get(`${FB_URL}/profile/${userID}.json`)
          .success(cb)
      },

      getEveryone(cb){
        $http
          .get(`${FB_URL}/profile.json`)
          .success(cb)
      }


    }
  });

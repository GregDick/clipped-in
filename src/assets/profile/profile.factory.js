angular
  .module('clippedIn')
  .factory('Profile', function($http, FB_URL){
    return{
      create(personObject, userID, cb){
        $http
          .put(`${FB_URL}/profile/${userID}.json`, personObject)
          .success(cb)
      },

      getProfile(profileID, cb){
        $http
          .get(`${FB_URL}/profile/${profileID}.json`)
          .success(cb)
      },

      getEveryone(cb){
        $http
          .get(`${FB_URL}/profile.json`)
          .success(cb)
      },

      addTopRope(profileID, userID, cb){
        $http
          .post(`${FB_URL}/topRope/${profileID}.json`, JSON.stringify(userID))
          .success(cb)
      },

      addLead(profileID, userID, cb){
        $http
          .post(`${FB_URL}/lead/${profileID}.json`, JSON.stringify(userID))
          .success(cb)
      },

      getTopRope(profileID, cb){
        $http
          .get(`${FB_URL}/topRope/${profileID}.json`)
          .success(cb)
      },

      getLead(profileID, cb){
        $http
          .get(`${FB_URL}/lead/${profileID}.json`)
          .success(cb)
      },

      deleteNotifications(profileID, cb){
        $http
          .delete(`${FB_URL}/profile/${profileID}/notifications.json`)
          .success(cb)
      }

    }
  });

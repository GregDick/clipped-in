angular
  .module('clippedIn')
  .factory('Profile', function($http, FB_URL){
    return{
      create: function(personObject, userID, cb){
        $http
          .put(`${FB_URL}/profile/${userID}.json`, personObject)
          .success(cb)
      },

      getProfile: function(profileID, cb){
        $http
          .get(`${FB_URL}/profile/${profileID}.json`)
          .success(cb)
      },

      getEveryone: function(cb){
        $http
          .get(`${FB_URL}/profile.json`)
          .success(cb)
      },

      addTopRope: function(profileID, userID, cb){
        $http
          .post(`${FB_URL}/topRope/${profileID}.json`, JSON.stringify(userID))
          .success(cb)
      },

      addLead: function(profileID, userID, cb){
        $http
          .post(`${FB_URL}/lead/${profileID}.json`, JSON.stringify(userID))
          .success(cb)
      },

      getTopRope: function(profileID, cb){
        $http
          .get(`${FB_URL}/topRope/${profileID}.json`)
          .success(cb)
      },

      getLead: function(profileID, cb){
        $http
          .get(`${FB_URL}/lead/${profileID}.json`)
          .success(cb)
      },

      deleteNotifications: function(profileID, cb){
        $http
          .delete(`${FB_URL}/profile/${profileID}/notifications.json`)
          .success(cb)
      }

    }
  });

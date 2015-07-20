angular
  .module('clippedIn')
  .factory('Outside', function($http, IP_GEO_URL, FB_URL){
    return{
      getGeo: function(cb){
        $http
          .get(IP_GEO_URL)
          .success(cb)
      },
      createTrip: function(tripObj, userID, cb){
        $http
          .put(`${FB_URL}/trip/${userID}.json`, tripObj)
          .success(cb)
      },
      getTrips: function(cb){
        $http
          .get(`${FB_URL}/trip.json`)
          .success(cb)
      },
      addTripRequest: function(plannerID, userID, cb){
        $http
          .put(`${FB_URL}/profile/${plannerID}/tripRequests/${userID}.json`, JSON.stringify(''))
          .success(cb)
      },
      deleteTripRequest: function(plannerID, memberID, cb){
        $http
          .delete(`${FB_URL}/profile/${plannerID}/tripRequests/${memberID}.json`)
          .success(cb)
      },
      getTripRequests: function(ID, cb){
        $http
          .get(`${FB_URL}/profile/${ID}/tripRequests.json`)
          .success(cb)
      },
      addTripMember: function(userID, memberID, cb){
        $http
          .post(`${FB_URL}/trip/${userID}/members.json`, JSON.stringify(memberID))
          .success(cb)
      },
      notify: function(requesterID, userID, value, cb){
        $http
          .put(`${FB_URL}/profile/${requesterID}/notifications/${userID}.json`, value)
          .success(cb)
      }
    }
  });

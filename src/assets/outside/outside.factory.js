angular
  .module('clippedIn')
  .factory('Outside', function($http, IP_GEO_URL, FB_URL){
    return{
      getGeo(cb){
        $http
          .get(IP_GEO_URL)
          .success(cb)
      },
      createTrip(tripObj, userID, cb){
        $http
          .put(`${FB_URL}/trip/${userID}.json`, tripObj)
          .success(cb)
      },
      getTrips(cb){
        $http
          .get(`${FB_URL}/trip.json`)
          .success(cb)
      },
      addTripRequest(plannerID, userID, cb){
        $http
          .put(`${FB_URL}/profile/${plannerID}/tripRequests/${userID}.json`, JSON.stringify(''))
          .success(cb)
      },
      deleteTripRequest(plannerID, memberID, cb){
        $http
          .delete(`${FB_URL}/profile/${plannerID}/tripRequests/${memberID}.json`)
          .success(cb)
      },
      getTripRequests(ID, cb){
        $http
          .get(`${FB_URL}/profile/${ID}/tripRequests.json`)
          .success(cb)
      },
      addTripMember(userID, memberID, cb){
        $http
          .post(`${FB_URL}/trip/${userID}/members.json`, JSON.stringify(memberID))
          .success(cb)
      },
      notify(requesterID, notifyObj, cb){
        $http
          .put(`${FB_URL}/profile/${requesterID}/notifications.json`, notifyObj)
          .success(cb)
      }
    }
  });

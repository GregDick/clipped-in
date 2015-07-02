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
          .put(`${FB_URL}/profile/${plannerID}/tripRequests.json`, JSON.stringify(userID))
          .success(cb)
      }
    }
  });

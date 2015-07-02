angular
  .module('clippedIn')
  .controller('OutsideCtrl', function(Outside, $rootScope, $location, Profile, $routeParams, SweetAlert){
//==================CONTROLLER FOR THE GET OUTSIDE PAGE====================
    var main = this;
    var userID = $rootScope.auth.uid;
    main.trip = {};
    main.viewID = $routeParams.id;

    //attach name and pic to trip obj
    Profile.getProfile(userID, function(response){
        main.trip.profPic = response.photo;
        main.trip.name = response.name;
        main.trip.who = [];
      })
    //create a trip... one per user
    main.createTrip = function(){
      Outside.createTrip(main.trip, userID, function(){
        $location.path('/outside');
      });
    }

    //get trip list
    Outside.getTrips(function(allTrips){
      main.allTrips = allTrips;
      main.thisTrip = allTrips[main.viewID];
    })

    //request to be added to trip members
    main.tripRequest = function(){
      Outside.addTripRequest(main.viewID, userID, function(list){
        console.log(list);
        SweetAlert.swal({
          title: 'Request Sent!',
          type: 'success',
          allowOutsideClick: true,
          showConfirmButton: false,
          timer: 3000
        });
      })
    }

    //get trip member's names


    //get IP location object
    Outside.getGeo(function(data){
      main.geoObj = data;
    })

    //randomize the background image
    var imgArr = ['Abiqua Falls.jpeg', 'Mt. Fuji .jpg', 'Banff National Park.jpeg',  'Mt. Fuji.jpeg', 'Bryce Canyon .jpg', 'Mt. Kilimanjaro.jpeg', 'Bryce Canyon.jpg', 'Mt. Whitney.jpg', 'Canadian Rockies.jpeg', 'Navagio Beach.jpeg', 'Crater Lake.jpeg', 'Obed River.jpg', 'Dolomites.jpeg', 'Patagonia.jpg', 'Everest.jpeg', 'Redwood National Park.jpg', 'Evergreen Mountain Lookout.jpeg', 'San Juan Mountains.jpg', 'Grand Tetons.jpeg', 'Sayram Lake.jpg', 'Half Dome.jpg', 'Snake River.jpeg', 'Isle of Skye.jpeg', 'Swiss Alps.jpg', 'Jasper National Park.jpeg', 'Tauglbach.jpg', 'Kauai.jpg', 'Torngat Mountains.jpg', 'Mt. Reinebringen .jpeg', 'Yosemite .jpg', 'Monument Valley.jpg', 'Yosemite.jpeg', 'Moraine Lake.jpeg'];
    var random = Math.floor(Math.random()*imgArr.length);
    main.pic = `img/${imgArr[random]}`;

  });

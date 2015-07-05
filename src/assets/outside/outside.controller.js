angular
  .module('clippedIn')
  .controller('OutsideCtrl', function(Outside, $rootScope, $location, Profile, $routeParams, SweetAlert){
//==================CONTROLLER FOR THE GET OUTSIDE PAGE====================
    var main = this;
    var userID = $rootScope.auth.uid;
    main.trip = {};
    main.viewID = $routeParams.id;

    //are you viewing your own trip page?
    main.self = main.viewID === userID ? true : false;

    //attach name and pic to trip obj
    Profile.getProfile(userID, function(response){
        main.trip.profPic = response.photo;
        main.trip.name = response.name;
        main.trip.members = [];
      })
    //create a trip. one per user
    main.createTrip = function(){
      Outside.createTrip(main.trip, userID, function(){
        $location.path('/outside');
      });
    }

    //get list of trips
    Outside.getTrips(function(allTrips){
      main.allTrips = allTrips;
      main.thisTrip = allTrips[main.viewID];

      //get profiles of current trip members
      main.thisTrip.profiles = [];
      for(var simpleID in main.thisTrip.members){
        //using closure again
        (function(profileID){
          Profile.getProfile(profileID, function(data){
            data.simpleLogin = profileID;
            main.thisTrip.profiles.push(data);
          })
        })(main.thisTrip.members[simpleID]);
      }

    })

    //request to be added to trip members
    main.tripRequest = function(){
      Outside.addTripRequest(main.viewID, userID, function(list){
        $('.request-button').addClass('disabled');
        SweetAlert.swal({
          title: 'Request Sent!',
          type: 'success',
          allowOutsideClick: true,
          showConfirmButton: false,
          timer: 3000
        });
      })
    }

    // get list of trip requests
    Outside.getTripRequests(main.viewID, function(response){
      main.requestList = response;
      main.nameList = [];
      for(var id in main.requestList){
        //disable button if you've already requested once
        if(id===userID){
          $('.request-button').addClass('disabled');
        }
        //get trip member's names
          //fuck yea just learned how to use closure
        (function(profileID){
          Profile.getProfile(profileID, function(data){
            data.simpleLogin = profileID;
            main.nameList.push(data);
          })
        })(id);
      }
    })

    //add to trip members and notify requester
    main.accept = function(simpleLogin, index){
      main[index] = true;
      Outside.deleteTripRequest(userID, simpleLogin, function(){});
      Outside.addTripMember(userID, simpleLogin, function(){});
      //notify requester
      Outside.notify(simpleLogin, userID, true, function(){
        SweetAlert.swal({
          title: 'Added to trip members!',
          type: 'success',
          allowOutsideClick: true,
          showConfirmButton: false,
          timer: 3000
        });
      })
    }

    //delete trip request and notify requester
    //===============request is dynamically generated so try $().on(click, 'request')


    main.reject = function(simpleLogin, index){
      main[index] = true;
      Outside.deleteTripRequest(userID, simpleLogin, function(){});
      //notify requester
      Outside.notify(simpleLogin, userID, false, function(){
        SweetAlert.swal({
          title: 'Request Deleted!',
          type: 'info',
          allowOutsideClick: true,
          showConfirmButton: false,
          timer: 3000
        });
      })
    }

    //get IP location object
    Outside.getGeo(function(data){
      main.geoObj = data;
    })

    //randomize the background image
    var imgArr = ['Abiqua Falls.jpeg', 'Mt. Fuji .jpg', 'Banff National Park.jpeg',  'Mt. Fuji.jpeg', 'Bryce Canyon .jpg', 'Mt. Kilimanjaro.jpeg', 'Bryce Canyon.jpg', 'Mt. Whitney.jpg', 'Canadian Rockies.jpeg', 'Navagio Beach.jpeg', 'Crater Lake.jpeg', 'Obed River.jpg', 'Dolomites.jpeg', 'Patagonia.jpg', 'Everest.jpeg', 'Redwood National Park.jpg', 'Evergreen Mountain Lookout.jpeg', 'San Juan Mountains.jpg', 'Grand Tetons.jpeg', 'Sayram Lake.jpg', 'Half Dome.jpg', 'Snake River.jpeg', 'Isle of Skye.jpeg', 'Swiss Alps.jpg', 'Jasper National Park.jpeg', 'Tauglbach.jpg', 'Kauai.jpg', 'Torngat Mountains.jpg', 'Mt. Reinebringen .jpeg', 'Yosemite .jpg', 'Monument Valley.jpg', 'Yosemite.jpeg', 'Moraine Lake.jpeg'];
    var random = Math.floor(Math.random()*imgArr.length);
    main.pic = `img/${imgArr[random]}`;

  });

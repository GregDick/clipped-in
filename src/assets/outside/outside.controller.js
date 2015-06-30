angular
  .module('clippedIn')
  .controller('OutsideCtrl', function(Outside, $rootScope, $location, Profile){
//==================CONTROLLER FOR THE GET OUTSIDE PAGE====================
    var main = this;
    var userID = $rootScope.auth.uid;
    main.profPic = [];

    //create a trip... one per user
    main.createTrip = function(){
      Outside.createTrip(main.trip, userID, function(res){
        $location.path('/outside');
      });
    }

    //get trip list
    Outside.getTrips(function(allTrips){
      main.allTrips = allTrips;
      //get prof pic for trip list
      for(var who in main.allTrips){
        Profile.getProfile(who, function(res){
          main.profPic.push(res.photo);
        });
      }
    })


    //get IP location object
    Outside.getGeo(function(data){
      main.geoObj = data;
    })

    //randomize the background image
    var imgArr = ['Abiqua Falls.jpeg', 'Mt. Fuji .jpg', 'Banff National Park.jpeg',  'Mt. Fuji.jpeg', 'Bryce Canyon .jpg', 'Mt. Kilimanjaro.jpeg', 'Bryce Canyon.jpg', 'Mt. Whitney.jpg', 'Canadian Rockies.jpeg', 'Navagio Beach.jpeg', 'Crater Lake.jpeg', 'Obed River.jpg', 'Dolomites.jpeg', 'Patagonia.jpg', 'Everest.jpeg', 'Redwood National Park.jpg', 'Evergreen Mountain Lookout.jpeg', 'San Juan Mountains.jpg', 'Grand Tetons.jpeg', 'Sayram Lake.jpg', 'Half Dome.jpg', 'Snake River.jpeg', 'Isle of Skye.jpeg', 'Swiss Alps.jpg', 'Jasper National Park.jpeg', 'Tauglbach.jpg', 'Kauai.jpg', 'Torngat Mountains.jpg', 'Mt. Reinebringen .jpeg', 'Yosemite .jpg', 'Monument Valley.jpg', 'Yosemite.jpeg', 'Moraine Lake.jpeg'];
    var random = Math.floor(Math.random()*imgArr.length);
    main.pic = `img/${imgArr[random]}`;

    //set overflow only on outside page
      //note: this command must be in javascript so that it activates on page change
    // $('body').css('overflow', 'hidden');

  });

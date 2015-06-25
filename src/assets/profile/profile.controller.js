angular
  .module('clippedIn')
  .controller('ProfileCtrl', function($scope, $rootScope, Profile, $location, $filter, FB_URL, Outside){
//==============THIS CONTROLLER IS FOR THE MEET THE LOCALS PAGE AND FOR VIEWING YOUR OWN PROFILE==========

    var main = this;
    main.belay = '';
    var fb = new Firebase(FB_URL);

    //on temp password redirect to temp
    if($rootScope.auth.password.isTemporaryPassword){
      $location.path('/temp');
    }else if(!$rootScope.auth){
      $location.path('/login');
      $scope.$apply();
    }else{}
    // popover toggle function
    main.toggleTop = function (){
      $('.topPop').popover('toggle');
    }
    main.toggleLead = function (){
      $('.leadPop').popover('toggle');
    }

    //get id of who is logged in
    var authData = fb.getAuth();
    main.id = authData.uid;

    Profile.getProfile($rootScope.auth.uid, function(profileObj){
      main.profileObj = profileObj;
      main.city = _.capitalize(profileObj.location.split(', ')[0]);
      main.state = _.capitalize(profileObj.location.split(', ')[1]);
      //set topRope and lead as booleans
      main.topRope = $filter('lowercase')(profileObj.topRope) === 'yes' ? true : false;
      main.lead = $filter('lowercase')(profileObj.lead) === 'yes' ? true : false;
      //set belay string
        if(main.topRope && main.lead){
          main.belay = ' can top-rope AND lead belay';
        }else if(main.topRope && !main.lead){
          main.belay = " can top-rope belay but doesn't know how to lead belay yet...";
        }else if(!main.topRope && main.lead){
          main.belay = " can lead belay but doesn't know how to top-rope belay yet...";
        }else{
          main.belay = " doesn't know how to belay yet...";
        }
    });

    Profile.getEveryone(function(everyoneObj){
      for(var x in everyoneObj){
        everyoneObj[x].city = _.capitalize(everyoneObj[x].location.split(', ')[0]);
        everyoneObj[x].state = _.capitalize(everyoneObj[x].location.split(', ')[1]);
        if(x === main.id){
          delete everyoneObj[x];
        }
      }
      main.everyoneObj = everyoneObj;
    })

    Profile.getTopRope(main.id, function(res){
      main.topRopeNames = [];
      //makes sure you can't endorse twice and sets popover array
      for(var id in res){
        if(res[id] === authData.uid){
          main.disableTopRope = true;
        }
        Profile.getProfile(res[id], function(profileObj){
          main.topRopeNames.push(profileObj.name);
          //lists first + number of endorsed
          if(main.topRopeNames.length > 2){
            main.topRopePeople = main.topRopeNames[0] + ' and ' + (main.topRopeNames.length - 1) +' other people think ';
          }else if(main.topRopeNames.length === 2){
            main.topRopePeople = main.topRopeNames[0] + ' and one other person think ';
          }else{
            main.topRopePeople = main.topRopeNames[0] + ' thinks ';
          }
        })
      }
    })

    Profile.getLead(main.id, function(res){
      main.leadNames = [];
      //makes sure you can't endorse twice and sets popover array
      for(var id in res){
        if(res[id] === authData.uid){
          main.disableLead = true;
        }
        Profile.getProfile(res[id], function(profileObj){
          main.leadNames.push(profileObj.name);
          //lists whoever endorsed
          if(main.leadNames.length > 2){
            main.leadPeople = main.leadNames[0] + ' and ' + (main.leadNames.length - 1) +' other people think ';
          }else if(main.leadNames.length === 2){
            main.leadPeople = main.leadNames[0] + ' and one other person think ';
          }
          else{
            main.leadPeople = main.leadNames[0] + ' thinks ';
          }
        })
      }
    })

    //get geolocation to filter users
    Outside.getGeo(function(data){
      console.log(data);
      main.geoObj = data;
    })

  });

angular
  .module('clippedIn')
  .controller('PersonCtrl', function(Profile, $routeParams, FB_URL, $filter, $scope, $rootScope, $location, Outside){
//=====================THIS CONTROLLER IS FOR VIEWING SOMEONE ELSE'S PROFILE===================
    var main = this;



    //call popover toggle function
    main.toggleTop = function (){
      $('.topPop').popover('toggle');
    }
    main.toggleLead = function (){
      $('.leadPop').popover('toggle');
    }
    //gets user information
    var fb = new Firebase(FB_URL);
    var authData = fb.getAuth();

    //gets id of profile that is being viewed
    main.id = $routeParams.id;

    //if this is your own profile redirect to /#/profile
    if(authData.uid === main.id){
      $location.path('/profile');
    }

    Profile.getProfile(main.id, function(profileObj){
      main.profileObj = profileObj;
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
    })

    checkTopRope();
    checkLead();

    main.endorseTopRope = function(){
      Profile.addTopRope(main.id, authData.uid, function(){
        checkTopRope();
      })
    }
    main.endorseLead = function(){
      Profile.addLead(main.id, authData.uid, function(){
        checkLead();
      })
    }

    function checkTopRope(){
      Profile.getTopRope(main.id, function(res){
        main.topRopeNames = [];
        //makes sure you can't endorse twice and sets popover array
        for(var id in res){
          if(res[id] === authData.uid){
            main.disableTopRope = true;
          }
          Profile.getProfile(res[id], function(profileObj){
            main.topRopeNames.push(profileObj.name);
            console.log(profileObj);
            //lists first + number of endorsed
            if(main.topRopeNames.length > 2){
              main.topRopePeople = main.topRopeNames[0] + ' and ' + (main.topRopeNames.length - 1) +' other people think ';
            }else if(main.topRopeNames.length === 2){
              main.topRopePeople = main.topRopeNames[0] + ' and 1 other person think ';
            }else{
              main.topRopePeople = main.topRopeNames[0] + ' thinks ';
            }
          })
        }
      })
    };

    function checkLead(){
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
              main.leadPeople = main.leadNames[0] + ' and 1 other person think ';
            }
            else{
              main.leadPeople = main.leadNames[0] + ' thinks ';
            }
          })
        }
      })
    };

    //get trip list to see if profile should link to trip
    Outside.getTrips(function(trips){
      main.trips = trips;
      for(var id in trips){
        if(main.id===id){
          main.tripLink = '/#/trip/'+id;
        }
      }
    });

  })

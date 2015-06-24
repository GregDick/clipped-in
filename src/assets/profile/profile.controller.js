angular
  .module('clippedIn')
  .controller('ProfileCtrl', function($rootScope, Profile, $location, $filter, FB_URL){
    var main = this;
    main.belay = '';
    var fb = new Firebase(FB_URL);


    //call popover toggle function
    main.toggleTop = function (){
      $('.topPop').popover('toggle');
    }
    main.toggleLead = function (){
      $('.leadPop').popover('toggle');
    }
    //on logout, send to login page
    if(!$rootScope.auth){
      $location.path('/login');
    }
    //get id of who is logged in
    var authData = fb.getAuth();
    main.id = authData.uid;

    Profile.getProfile($rootScope.auth.uid, function(profileObj){
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
    });

    Profile.getEveryone(function(everyoneObj){
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

  });

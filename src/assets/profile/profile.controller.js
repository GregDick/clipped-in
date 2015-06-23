angular
  .module('clippedIn')
  .controller('ProfileCtrl', function($rootScope, Profile, $location, $filter, FB_URL){
    var main = this;
    main.belay = '';
    var fb = new Firebase(FB_URL);

    if(!$rootScope.auth){
      $location.path('/login');
    }

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
      main.topRopeArr = Object.keys(res);
      Profile.getProfile(res[main.topRopeArr[0]], function(profileObj){
        main.topRopeFirst = profileObj.name;
        if(main.topRopeArr.length > 2){
          main.topRopePeople = main.topRopeFirst + ' and ' + (main.topRopeArr.length - 1) +' other people think ';
        }else if(main.topRopeArr.length === 2){
          main.topRopePeople = main.topRopeFirst + ' and one other person think ';
        }else{
          main.topRopePeople = main.topRopeFirst + ' thinks ';
        }
      })
    })

    Profile.getLead(main.id, function(res){
      main.leadArr = Object.keys(res);
      Profile.getProfile(res[main.leadArr[0]], function(profileObj){
        main.leadFirst = profileObj.name;
        if(main.leadArr.length > 2){
          main.leadPeople = main.leadFirst + ' and ' + (main.leadArr.length - 1) +' other people think ';
        }else if(main.leadArr.length === 2){
          main.leadPeople = main.leadFirst + ' and one other person think ';
        }
        else{
          main.leadPeople = main.leadFirst + ' thinks ';
        }
      })
    })

  });

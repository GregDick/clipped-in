angular
  .module('clippedIn')
  .controller('ProfileCtrl', function($rootScope, Profile, $location, $filter){
    var main = this;
    main.belay = '';

    if(!$rootScope.auth){
      $location.path('/login');
    }

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




  });

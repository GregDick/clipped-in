angular
  .module('clippedIn')
  .controller('PersonCtrl', function(Profile, $routeParams, FB_URL, $filter, $scope){
    var main = this;

    //gets user information
    var fb = new Firebase(FB_URL);
    var authData = fb.getAuth();

    //gets id of profile that is being viewed
    main.id = $routeParams.id;

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
        console.log('working');
        checkTopRope();
      })
    }
    main.endorseLead = function(){
      Profile.addLead(main.id, authData.uid, function(){
        console.log('workin');
        checkLead();
      })
    }

    function checkTopRope(){
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
    };

    function checkLead(){
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
    };


  })

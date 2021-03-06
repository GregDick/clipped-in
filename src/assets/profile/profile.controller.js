angular
  .module('clippedIn')
  .controller('ProfileCtrl', function($scope, $rootScope, Profile, $location,
   $filter, FB_URL, Outside, $firebaseObject, SweetAlert){
//==============THIS CONTROLLER IS FOR THE MEET THE LOCALS PAGE AND FOR VIEWING YOUR OWN PROFILE==========

    var main = this;
    main.belay = '';
    var fb = new Firebase(FB_URL);

    //get id of who is logged in
    var authData = fb.getAuth();
    main.id = authData.uid;

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

    //make own profile editable with three-way data binding
    //also gets profile data
    var fbBind = new Firebase(`${FB_URL}/profile/${main.id}`)
    main.syncObject = $firebaseObject(fbBind);
    main.syncObject.$bindTo($scope, "myProfile").then(function(){
      //set topRope and lead as booleans
      main.topRope = $filter('lowercase')(main.syncObject.topRope) === 'yes' ? true : false;
      main.lead = $filter('lowercase')(main.syncObject.lead) === 'yes' ? true : false;
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
      //notify of notifications
      var textString = '';
      for(var who in main.syncObject.notifications){
        //use closure
        (function(profileID){
          Profile.getProfile(profileID, function(data){

            if(main.syncObject.notifications[profileID] === true){
              textString += data.name + ' added you to their trip!\n'
            }
            else{
              textString += data.name + " didn't add you to their trip...\n"
            }
            //pop up notification followed by delete notification
            SweetAlert.swal({
              title: 'Trip Request Notification!',
              type: 'warning',
              text: textString,
              confirmButtonText: "Sound's Good! Delete this notification"
            },
              Profile.deleteNotifications(main.id, function(){})
            );

          })
        })(who);
      }

    })

    //get trip list to see if profile should link to trip
    Outside.getTrips(function(trips){
      main.trips = trips;
      for(var id in trips){
        if(main.id===id){
          main.tripLink = '#/trip/'+id;
        }
      }
    });

    //show edit-modal
    main.modalLoad = function(){
      $('#edit-modal').modal('show');
      $('#edit-modal').on('hidden.bs.modal', function (e) {
        $location.path('/profile');
        $scope.$apply();
      });
    }

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
          if(profileObj){
            main.topRopeNames.push(profileObj.name);
            //lists first + number of endorsed
            if(main.topRopeNames.length > 2){
              main.topRopePeople = main.topRopeNames[0] + ' and ' + (main.topRopeNames.length - 1) +' other people think ';
            }else if(main.topRopeNames.length === 2){
              main.topRopePeople = main.topRopeNames[0] + ' and 1 other person think ';
            }else{
              main.topRopePeople = main.topRopeNames[0] + ' thinks ';
            }
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
          if(profileObj){
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
          }
        })
      }
    })

    //get geolocation to filter users
    Outside.getGeo(function(data){
      main.geoObj = data;
    })

    // show names on user hover
    main.show = function(event){
      $('.profile-item').closest('span').removeClass('hidden');
      $('img').closest('span').addClass('backdrop');
    }
    main.hide = function(event){
      $('.profile-item').closest('span').addClass('hidden');
      $('img').closest('span').removeClass('backdrop');
    }

    // $('.profile-item')
    //   .on('mouseover', function(){
    //     $(event.target).closest('span').removeClass('hidden');
    //     debugger;
    //   })
    //   .on('mouseout', function(){
    //     $(event.target).closest('span').addClass('hidden');
    //   })

  });

'use strict';

angular.module('clippedIn').controller('ProfileCtrl', function ($scope, $rootScope, Profile, $location, $filter, FB_URL, Outside, $firebaseObject, SweetAlert) {
  //==============THIS CONTROLLER IS FOR THE MEET THE LOCALS PAGE AND FOR VIEWING YOUR OWN PROFILE==========

  var main = this;
  main.belay = '';
  var fb = new Firebase(FB_URL);

  //get id of who is logged in
  var authData = fb.getAuth();
  main.id = authData.uid;

  //on temp password redirect to temp
  if ($rootScope.auth.password.isTemporaryPassword) {
    $location.path('/temp');
  } else if (!$rootScope.auth) {
    $location.path('/login');
    $scope.$apply();
  } else {}

  // popover toggle function
  main.toggleTop = function () {
    $('.topPop').popover('toggle');
  };
  main.toggleLead = function () {
    $('.leadPop').popover('toggle');
  };

  //make own profile editable with three-way data binding
  //also gets profile data
  var fbBind = new Firebase('' + FB_URL + '/profile/' + main.id);
  main.syncObject = $firebaseObject(fbBind);
  main.syncObject.$bindTo($scope, 'myProfile').then(function () {
    //set topRope and lead as booleans
    main.topRope = $filter('lowercase')(main.syncObject.topRope) === 'yes' ? true : false;
    main.lead = $filter('lowercase')(main.syncObject.lead) === 'yes' ? true : false;
    //set belay string
    if (main.topRope && main.lead) {
      main.belay = ' can top-rope AND lead belay';
    } else if (main.topRope && !main.lead) {
      main.belay = ' can top-rope belay but doesn\'t know how to lead belay yet...';
    } else if (!main.topRope && main.lead) {
      main.belay = ' can lead belay but doesn\'t know how to top-rope belay yet...';
    } else {
      main.belay = ' doesn\'t know how to belay yet...';
    }
    //notify of notifications
    var textString = '';
    for (var who in main.syncObject.notifications) {
      //use closure
      (function (profileID) {
        Profile.getProfile(profileID, function (data) {

          if (main.syncObject.notifications[profileID] === true) {
            textString += data.name + ' added you to their trip!\n';
          } else {
            textString += data.name + ' didn\'t add you to their trip...\n';
          }
          //pop up notification followed by delete notification
          SweetAlert.swal({
            title: 'Trip Request Notification!',
            type: 'warning',
            text: textString,
            confirmButtonText: 'Sound\'s Good! Delete this notification'
          }, Profile.deleteNotifications(main.id, function () {}));
        });
      })(who);
    }
  });

  //get trip list to see if profile should link to trip
  Outside.getTrips(function (trips) {
    main.trips = trips;
    for (var id in trips) {
      if (main.id === id) {
        main.tripLink = '/#/trip/' + id;
      }
    }
  });

  //show edit-modal
  main.modalLoad = function () {
    $('#edit-modal').modal('show');
    $('#edit-modal').on('hidden.bs.modal', function (e) {
      $location.path('/profile');
      $scope.$apply();
    });
  };

  Profile.getEveryone(function (everyoneObj) {
    for (var x in everyoneObj) {
      everyoneObj[x].city = _.capitalize(everyoneObj[x].location.split(', ')[0]);
      everyoneObj[x].state = _.capitalize(everyoneObj[x].location.split(', ')[1]);
      if (x === main.id) {
        delete everyoneObj[x];
      }
    }
    main.everyoneObj = everyoneObj;
  });

  Profile.getTopRope(main.id, function (res) {
    main.topRopeNames = [];
    //makes sure you can't endorse twice and sets popover array
    for (var id in res) {
      if (res[id] === authData.uid) {
        main.disableTopRope = true;
      }
      Profile.getProfile(res[id], function (profileObj) {
        main.topRopeNames.push(profileObj.name);
        //lists first + number of endorsed
        if (main.topRopeNames.length > 2) {
          main.topRopePeople = main.topRopeNames[0] + ' and ' + (main.topRopeNames.length - 1) + ' other people think ';
        } else if (main.topRopeNames.length === 2) {
          main.topRopePeople = main.topRopeNames[0] + ' and 1 other person think ';
        } else {
          main.topRopePeople = main.topRopeNames[0] + ' thinks ';
        }
      });
    }
  });

  Profile.getLead(main.id, function (res) {
    main.leadNames = [];
    //makes sure you can't endorse twice and sets popover array
    for (var id in res) {
      if (res[id] === authData.uid) {
        main.disableLead = true;
      }
      Profile.getProfile(res[id], function (profileObj) {
        main.leadNames.push(profileObj.name);
        //lists whoever endorsed
        if (main.leadNames.length > 2) {
          main.leadPeople = main.leadNames[0] + ' and ' + (main.leadNames.length - 1) + ' other people think ';
        } else if (main.leadNames.length === 2) {
          main.leadPeople = main.leadNames[0] + ' and 1 other person think ';
        } else {
          main.leadPeople = main.leadNames[0] + ' thinks ';
        }
      });
    }
  });

  //get geolocation to filter users
  Outside.getGeo(function (data) {
    main.geoObj = data;
  });

  // show names on user hover
  main.show = function (event) {
    $('.profile-item').closest('span').removeClass('hidden');
    $('img').closest('span').addClass('backdrop');
  };
  main.hide = function (event) {
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

  ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc3NldHMvcHJvZmlsZS9wcm9maWxlLmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQ0osTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUNuQixVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVMsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUN6RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFDOzs7QUFHckQsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE1BQUksRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHOUIsTUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLE1BQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQzs7O0FBR3ZCLE1BQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUM7QUFDOUMsYUFBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN6QixNQUFLLElBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDO0FBQ3hCLGFBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsVUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2pCLE1BQUksRUFBRTs7O0FBR1AsTUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFXO0FBQzFCLEtBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEMsQ0FBQTtBQUNELE1BQUksQ0FBQyxVQUFVLEdBQUcsWUFBVztBQUMzQixLQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ2pDLENBQUE7Ozs7QUFJRCxNQUFJLE1B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L2Fzc2V0cy9wcm9maWxlL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgLm1vZHVsZSgnY2xpcHBlZEluJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCBQcm9maWxlLCAkbG9jYXRpb24sXG4gICAkZmlsdGVyLCBGQl9VUkwsIE91dHNpZGUsICRmaXJlYmFzZU9iamVjdCwgU3dlZXRBbGVydCl7XG4vLz09PT09PT09PT09PT09VEhJUyBDT05UUk9MTEVSIElTIEZPUiBUSEUgTUVFVCBUSEUgTE9DQUxTIFBBR0UgQU5EIEZPUiBWSUVXSU5HIFlPVVIgT1dOIFBST0ZJTEU9PT09PT09PT09XG5cbiAgICB2YXIgbWFpbiA9IHRoaXM7XG4gICAgbWFpbi5iZWxheSA9ICcnO1xuICAgIHZhciBmYiA9IG5ldyBGaXJlYmFzZShGQl9VUkwpO1xuXG4gICAgLy9nZXQgaWQgb2Ygd2hvIGlzIGxvZ2dlZCBpblxuICAgIHZhciBhdXRoRGF0YSA9IGZiLmdldEF1dGgoKTtcbiAgICBtYWluLmlkID0gYXV0aERhdGEudWlkO1xuXG4gICAgLy9vbiB0ZW1wIHBhc3N3b3JkIHJlZGlyZWN0IHRvIHRlbXBcbiAgICBpZigkcm9vdFNjb3BlLmF1dGgucGFzc3dvcmQuaXNUZW1wb3JhcnlQYXNzd29yZCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3RlbXAnKTtcbiAgICB9ZWxzZSBpZighJHJvb3RTY29wZS5hdXRoKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICB9ZWxzZXt9XG5cbiAgICAvLyBwb3BvdmVyIHRvZ2dsZSBmdW5jdGlvblxuICAgIG1haW4udG9nZ2xlVG9wID0gZnVuY3Rpb24gKCl7XG4gICAgICAkKCcudG9wUG9wJykucG9wb3ZlcigndG9nZ2xlJyk7XG4gICAgfVxuICAgIG1haW4udG9nZ2xlTGVhZCA9IGZ1bmN0aW9uICgpe1xuICAgICAgJCgnLmxlYWRQb3AnKS5wb3BvdmVyKCd0b2dnbGUnKTtcbiAgICB9XG5cbiAgICAvL21ha2Ugb3duIHByb2ZpbGUgZWRpdGFibGUgd2l0aCB0aHJlZS13YXkgZGF0YSBiaW5kaW5nXG4gICAgLy9hbHNvIGdldHMgcHJvZmlsZSBkYXRhXG4gICAgdmFyIGZiQmluZCA9IG5ldyBGaXJlYmFzZShgJHtGQl9VUkx9L3Byb2ZpbGUvJHttYWluLmlkfWApXG4gICAgbWFpbi5zeW5jT2JqZWN0ID0gJGZpcmViYXNlT2JqZWN0KGZiQmluZCk7XG4gICAgbWFpbi5zeW5jT2JqZWN0LiRiaW5kVG8oJHNjb3BlLCBcIm15UHJvZmlsZVwiKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAvL3NldCB0b3BSb3BlIGFuZCBsZWFkIGFzIGJvb2xlYW5zXG4gICAgICBtYWluLnRvcFJvcGUgPSAkZmlsdGVyKCdsb3dlcmNhc2UnKShtYWluLnN5bmNPYmplY3QudG9wUm9wZSkgPT09ICd5ZXMnID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgbWFpbi5sZWFkID0gJGZpbHRlcignbG93ZXJjYXNlJykobWFpbi5zeW5jT2JqZWN0LmxlYWQpID09PSAneWVzJyA/IHRydWUgOiBmYWxzZTtcbiAgICAgIC8vc2V0IGJlbGF5IHN0cmluZ1xuICAgICAgaWYobWFpbi50b3BSb3BlICYmIG1haW4ubGVhZCl7XG4gICAgICAgIG1haW4uYmVsYXkgPSAnIGNhbiB0b3Atcm9wZSBBTkQgbGVhZCBiZWxheSc7XG4gICAgICB9ZWxzZSBpZihtYWluLnRvcFJvcGUgJiYgIW1haW4ubGVhZCl7XG4gICAgICAgIG1haW4uYmVsYXkgPSBcIiBjYW4gdG9wLXJvcGUgYmVsYXkgYnV0IGRvZXNuJ3Qga25vdyBob3cgdG8gbGVhZCBiZWxheSB5ZXQuLi5cIjtcbiAgICAgIH1lbHNlIGlmKCFtYWluLnRvcFJvcGUgJiYgbWFpbi5sZWFkKXtcbiAgICAgICAgbWFpbi5iZWxheSA9IFwiIGNhbiBsZWFkIGJlbGF5IGJ1dCBkb2Vzbid0IGtub3cgaG93IHRvIHRvcC1yb3BlIGJlbGF5IHlldC4uLlwiO1xuICAgICAgfWVsc2V7XG4gICAgICAgIG1haW4uYmVsYXkgPSBcIiBkb2Vzbid0IGtub3cgaG93IHRvIGJlbGF5IHlldC4uLlwiO1xuICAgICAgfVxuICAgICAgLy9ub3RpZnkgb2Ygbm90aWZpY2F0aW9uc1xuICAgICAgdmFyIHRleHRTdHJpbmcgPSAnJztcbiAgICAgIGZvcih2YXIgd2hvIGluIG1haW4uc3luY09iamVjdC5ub3RpZmljYXRpb25zKXtcbiAgICAgICAgLy91c2UgY2xvc3VyZVxuICAgICAgICAoZnVuY3Rpb24ocHJvZmlsZUlEKXtcbiAgICAgICAgICBQcm9maWxlLmdldFByb2ZpbGUocHJvZmlsZUlELCBmdW5jdGlvbihkYXRhKXtcblxuICAgICAgICAgICAgaWYobWFpbi5zeW5jT2JqZWN0Lm5vdGlmaWNhdGlvbnNbcHJvZmlsZUlEXSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgIHRleHRTdHJpbmcgKz0gZGF0YS5uYW1lICsgJyBhZGRlZCB5b3UgdG8gdGhlaXIgdHJpcCFcXG4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICB0ZXh0U3RyaW5nICs9IGRhdGEubmFtZSArIFwiIGRpZG4ndCBhZGQgeW91IHRvIHRoZWlyIHRyaXAuLi5cXG5cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9wb3AgdXAgbm90aWZpY2F0aW9uIGZvbGxvd2VkIGJ5IGRlbGV0ZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgIFN3ZWV0QWxlcnQuc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiAnVHJpcCBSZXF1ZXN0IE5vdGlmaWNhdGlvbiEnLFxuICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgIHRleHQ6IHRleHRTdHJpbmcsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlNvdW5kJ3MgR29vZCEgRGVsZXRlIHRoaXMgbm90aWZpY2F0aW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFByb2ZpbGUuZGVsZXRlTm90aWZpY2F0aW9ucyhtYWluLmlkLCBmdW5jdGlvbigpe30pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSkod2hvKTtcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICAvL2dldCB0cmlwIGxpc3QgdG8gc2VlIGlmIHByb2ZpbGUgc2hvdWxkIGxpbmsgdG8gdHJpcFxuICAgIE91dHNpZGUuZ2V0VHJpcHMoZnVuY3Rpb24odHJpcHMpe1xuICAgICAgbWFpbi50cmlwcyA9IHRyaXBzO1xuICAgICAgZm9yKHZhciBpZCBpbiB0cmlwcyl7XG4gICAgICAgIGlmKG1haW4uaWQ9PT1pZCl7XG4gICAgICAgICAgbWFpbi50cmlwTGluayA9ICcvIy90cmlwLycraWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vc2hvdyBlZGl0LW1vZGFsXG4gICAgbWFpbi5tb2RhbExvYWQgPSBmdW5jdGlvbigpe1xuICAgICAgJCgnI2VkaXQtbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgJCgnI2VkaXQtbW9kYWwnKS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9maWxlJyk7XG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIFByb2ZpbGUuZ2V0RXZlcnlvbmUoZnVuY3Rpb24oZXZlcnlvbmVPYmope1xuICAgICAgZm9yKHZhciB4IGluIGV2ZXJ5b25lT2JqKXtcbiAgICAgICAgZXZlcnlvbmVPYmpbeF0uY2l0eSA9IF8uY2FwaXRhbGl6ZShldmVyeW9uZU9ialt4XS5sb2NhdGlvbi5zcGxpdCgnLCAnKVswXSk7XG4gICAgICAgIGV2ZXJ5b25lT2JqW3hdLnN0YXRlID0gXy5jYXBpdGFsaXplKGV2ZXJ5b25lT2JqW3hdLmxvY2F0aW9uLnNwbGl0KCcsICcpWzFdKTtcbiAgICAgICAgaWYoeCA9PT0gbWFpbi5pZCl7XG4gICAgICAgICAgZGVsZXRlIGV2ZXJ5b25lT2JqW3hdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYWluLmV2ZXJ5b25lT2JqID0gZXZlcnlvbmVPYmo7XG4gICAgfSlcblxuICAgIFByb2ZpbGUuZ2V0VG9wUm9wZShtYWluLmlkLCBmdW5jdGlvbihyZXMpe1xuICAgICAgbWFpbi50b3BSb3BlTmFtZXMgPSBbXTtcbiAgICAgIC8vbWFrZXMgc3VyZSB5b3UgY2FuJ3QgZW5kb3JzZSB0d2ljZSBhbmQgc2V0cyBwb3BvdmVyIGFycmF5XG4gICAgICBmb3IodmFyIGlkIGluIHJlcyl7XG4gICAgICAgIGlmKHJlc1tpZF0gPT09IGF1dGhEYXRhLnVpZCl7XG4gICAgICAgICAgbWFpbi5kaXNhYmxlVG9wUm9wZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgUHJvZmlsZS5nZXRQcm9maWxlKHJlc1tpZF0sIGZ1bmN0aW9uKHByb2ZpbGVPYmope1xuICAgICAgICAgIG1haW4udG9wUm9wZU5hbWVzLnB1c2gocHJvZmlsZU9iai5uYW1lKTtcbiAgICAgICAgICAvL2xpc3RzIGZpcnN0ICsgbnVtYmVyIG9mIGVuZG9yc2VkXG4gICAgICAgICAgaWYobWFpbi50b3BSb3BlTmFtZXMubGVuZ3RoID4gMil7XG4gICAgICAgICAgICBtYWluLnRvcFJvcGVQZW9wbGUgPSBtYWluLnRvcFJvcGVOYW1lc1swXSArICcgYW5kICcgKyAobWFpbi50b3BSb3BlTmFtZXMubGVuZ3RoIC0gMSkgKycgb3RoZXIgcGVvcGxlIHRoaW5rICc7XG4gICAgICAgICAgfWVsc2UgaWYobWFpbi50b3BSb3BlTmFtZXMubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgIG1haW4udG9wUm9wZVBlb3BsZSA9IG1haW4udG9wUm9wZU5hbWVzWzBdICsgJyBhbmQgMSBvdGhlciBwZXJzb24gdGhpbmsgJztcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIG1haW4udG9wUm9wZVBlb3BsZSA9IG1haW4udG9wUm9wZU5hbWVzWzBdICsgJyB0aGlua3MgJztcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIFByb2ZpbGUuZ2V0TGVhZChtYWluLmlkLCBmdW5jdGlvbihyZXMpe1xuICAgICAgbWFpbi5sZWFkTmFtZXMgPSBbXTtcbiAgICAgIC8vbWFrZXMgc3VyZSB5b3UgY2FuJ3QgZW5kb3JzZSB0d2ljZSBhbmQgc2V0cyBwb3BvdmVyIGFycmF5XG4gICAgICBmb3IodmFyIGlkIGluIHJlcyl7XG4gICAgICAgIGlmKHJlc1tpZF0gPT09IGF1dGhEYXRhLnVpZCl7XG4gICAgICAgICAgbWFpbi5kaXNhYmxlTGVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgUHJvZmlsZS5nZXRQcm9maWxlKHJlc1tpZF0sIGZ1bmN0aW9uKHByb2ZpbGVPYmope1xuICAgICAgICAgIG1haW4ubGVhZE5hbWVzLnB1c2gocHJvZmlsZU9iai5uYW1lKTtcbiAgICAgICAgICAvL2xpc3RzIHdob2V2ZXIgZW5kb3JzZWRcbiAgICAgICAgICBpZihtYWluLmxlYWROYW1lcy5sZW5ndGggPiAyKXtcbiAgICAgICAgICAgIG1haW4ubGVhZFBlb3BsZSA9IG1haW4ubGVhZE5hbWVzWzBdICsgJyBhbmQgJyArIChtYWluLmxlYWROYW1lcy5sZW5ndGggLSAxKSArJyBvdGhlciBwZW9wbGUgdGhpbmsgJztcbiAgICAgICAgICB9ZWxzZSBpZihtYWluLmxlYWROYW1lcy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgbWFpbi5sZWFkUGVvcGxlID0gbWFpbi5sZWFkTmFtZXNbMF0gKyAnIGFuZCAxIG90aGVyIHBlcnNvbiB0aGluayAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgbWFpbi5sZWFkUGVvcGxlID0gbWFpbi5sZWFkTmFtZXNbMF0gKyAnIHRoaW5rcyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy9nZXQgZ2VvbG9jYXRpb24gdG8gZmlsdGVyIHVzZXJzXG4gICAgT3V0c2lkZS5nZXRHZW8oZnVuY3Rpb24oZGF0YSl7XG4gICAgICBtYWluLmdlb09iaiA9IGRhdGE7XG4gICAgfSlcblxuICAgIC8vIHNob3cgbmFtZXMgb24gdXNlciBob3ZlclxuICAgIG1haW4uc2hvdyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICQoJy5wcm9maWxlLWl0ZW0nKS5jbG9zZXN0KCdzcGFuJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgJCgnaW1nJykuY2xvc2VzdCgnc3BhbicpLmFkZENsYXNzKCdiYWNrZHJvcCcpO1xuICAgIH1cbiAgICBtYWluLmhpZGUgPSBmdW5jdGlvbihldmVudCl7XG4gICAgICAkKCcucHJvZmlsZS1pdGVtJykuY2xvc2VzdCgnc3BhbicpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICQoJ2ltZycpLmNsb3Nlc3QoJ3NwYW4nKS5yZW1vdmVDbGFzcygnYmFja2Ryb3AnKTtcbiAgICB9XG5cbiAgICAvLyAkKCcucHJvZmlsZS1pdGVtJylcbiAgICAvLyAgIC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJ3NwYW4nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgLy8gICAgIGRlYnVnZ2VyO1xuICAgIC8vICAgfSlcbiAgICAvLyAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbigpe1xuICAgIC8vICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnc3BhbicpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAvLyAgIH0pXG5cbiAgfSk7XG4iXX0=

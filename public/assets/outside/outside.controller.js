'use strict';

angular.module('clippedIn').controller('OutsideCtrl', function (Outside, $rootScope, $location, Profile, $routeParams, SweetAlert, $scope, $animate) {
  //==================CONTROLLER FOR THE GET OUTSIDE PAGE====================
  var main = this;
  var userID = $rootScope.auth.uid;
  main.trip = {};
  main.viewID = $routeParams.id;

  //are you viewing your own trip page?
  main.self = main.viewID === userID ? true : false;

  //attach name and pic to trip obj
  Profile.getProfile(userID, function (response) {
    main.trip.profPic = response.photo;
    main.trip.name = response.name;
    main.trip.members = [];
  });
  //create a trip. one per user
  main.createTrip = function () {
    Outside.createTrip(main.trip, userID, function () {
      $location.path('/outside');
    });
  };

  //get list of trips
  Outside.getTrips(function (allTrips) {
    main.allTrips = allTrips;
    main.thisTrip = allTrips[main.viewID];

    //get profiles of current trip members
    main.thisTrip.profiles = [];
    for (var simpleID in main.thisTrip.members) {
      if (userID === main.thisTrip.members[simpleID]) {
        $('.request-button').addClass('disabled');
      }
      //using closure again
      (function (profileID) {
        Profile.getProfile(profileID, function (data) {
          data.simpleLogin = profileID;
          main.thisTrip.profiles.push(data);
        });
      })(main.thisTrip.members[simpleID]);
    }
  });

  //request to be added to trip members
  main.tripRequest = function () {
    Outside.addTripRequest(main.viewID, userID, function (list) {
      $('.request-button').addClass('disabled');
      SweetAlert.swal({
        title: 'Request Sent!',
        type: 'success',
        allowOutsideClick: true,
        showConfirmButton: false,
        timer: 3000
      });
    });
  };

  // get list of trip requests
  Outside.getTripRequests(main.viewID, function (response) {
    main.requestList = response;
    main.nameList = [];
    for (var id in main.requestList) {
      //disable button if you've already requested once
      if (id === userID) {
        $('.request-button').addClass('disabled');
      }
      //get trip member's names
      //fuck yea just learned how to use closure
      (function (profileID) {
        Profile.getProfile(profileID, function (data) {
          data.simpleLogin = profileID;
          main.nameList.push(data);
        });
      })(id);
    }
  });

  //add to trip members and notify requester
  main.accept = function (simpleLogin, index) {
    main[index] = true;
    Outside.deleteTripRequest(userID, simpleLogin, function () {});
    Outside.addTripMember(userID, simpleLogin, function () {});
    //notify requester
    Outside.notify(simpleLogin, userID, true, function () {
      SweetAlert.swal({
        title: 'Added to trip members!',
        type: 'success',
        allowOutsideClick: true,
        showConfirmButton: false,
        timer: 3000
      });
    });
  };

  //delete trip request and notify requester
  //===============request is dynamically generated so try $().on(click, 'request')

  main.reject = function (simpleLogin, index) {
    main[index] = true;
    Outside.deleteTripRequest(userID, simpleLogin, function () {});
    //notify requester
    Outside.notify(simpleLogin, userID, false, function () {
      SweetAlert.swal({
        title: 'Request Deleted!',
        type: 'info',
        allowOutsideClick: true,
        showConfirmButton: false,
        timer: 3000
      });
    });
  };

  //initialize datepicker
  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.format = 'dd-MMMM-yyyy';

  //get IP location object
  Outside.getGeo(function (data) {
    main.geoObj = data;
  });

  //randomize the background image
  var imgArr = ['Abiqua Falls.jpeg', 'Mt. Fuji .jpg', 'Banff National Park.jpeg', 'Mt. Fuji.jpeg', 'Bryce Canyon .jpg', 'Mt. Kilimanjaro.jpeg', 'Bryce Canyon.jpg', 'Mt. Whitney.jpg', 'Canadian Rockies.jpeg', 'Navagio Beach.jpeg', 'Crater Lake.jpeg', 'Obed River.jpg', 'Dolomites.jpeg', 'Patagonia.jpg', 'Everest.jpeg', 'Redwood National Park.jpg', 'Evergreen Mountain Lookout.jpeg', 'San Juan Mountains.jpg', 'Grand Tetons.jpeg', 'Sayram Lake.jpg', 'Half Dome.jpg', 'Snake River.jpeg', 'Isle of Skye.jpeg', 'Swiss Alps.jpg', 'Jasper National Park.jpeg', 'Tauglbach.jpg', 'Kauai.jpg', 'Torngat Mountains.jpg', 'Yosemite .jpg', 'Monument Valley.jpg', 'Yosemite.jpeg', 'Moraine Lake.jpeg'];
  var randomPic = imgArr[Math.floor(Math.random() * imgArr.length)];
  main.pic = 'img/' + randomPic;
  //caption for image
  var captionArr = randomPic.split('.jp');
  main.picText = captionArr[0];
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc3NldHMvb3V0c2lkZS9vdXRzaWRlLmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQ0osTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUNuQixVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQzs7QUFFdEgsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2pDLE1BQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsRUFBRSxDQUFDOzs7QUFHOUIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDOzs7QUFHbEQsU0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxRQUFRLEVBQUM7QUFDekMsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNuQyxRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUN4QixDQUFDLENBQUE7O0FBRUosTUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFVO0FBQzFCLFdBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBVTtBQUM5QyxlQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQztHQUNKLENBQUE7OztBQUdELFNBQU8sQ0FBQyxRQUFRLENBQUMsVUFBUyxRQUFRLEVBQUM7QUFDakMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHdEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFNBQUksSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUM7QUFDeEMsVUFBRyxNQUFNLEtBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUM7QUFDMUMsU0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQzNDOztBQUVELE9BQUMsVUFBUyxTQUFTLEVBQUM7QUFDbEIsZUFBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJLEVBQUM7QUFDMUMsY0FBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFDN0IsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DLENBQUMsQ0FBQTtPQUNILENBQUEsQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0dBRUYsQ0FBQyxDQUFBOzs7QUFHRixNQUFJLENBQUMsV0FBVyxHQUFHLFlBQVU7QUFDM0IsV0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBQztBQUN4RCxPQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsZ0JBQVUsQ0FBQyxJQUFJLENBQUM7QUFDZCxhQUFLLEVBQUUsZUFBZTtBQUN0QixZQUFJLEVBQUUsU0FBUztBQUNmLHlCQUFpQixFQUFFLElBQUk7QUFDdkIseUJBQWlCLEVBQUUsS0FBSztBQUN4QixhQUFLLEVBQUUsSUFBSTtPQUNaLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQTtHQUNILENBQUE7OztBQUdELFNBQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFTLFFBQVEsRUFBQztBQUNyRCxRQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixTQUFJLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUM7O0FBRTdCLFVBQUcsRUFBRSxLQUFHLE1BQU0sRUFBQztBQUNiLFNBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUMzQzs7O0FBR0QsT0FBQyxVQUFTLFNBQVMsRUFBQztBQUNsQixlQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUksRUFBQztBQUMxQyxjQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM3QixjQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQixDQUFDLENBQUE7T0FDSCxDQUFBLENBQUUsRUFBRSxDQUFDLENBQUM7S0FDUjtHQUNGLENBQUMsQ0FBQTs7O0FBR0YsTUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFTLFdBQVcsRUFBRSxLQUFLLEVBQUM7QUFDeEMsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNuQixXQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFdBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFVLEVBQUUsQ0FBQyxDQUFDOztBQUV6RCxXQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVU7QUFDbEQsZ0JBQVUsQ0FBQyxJQUFJLENBQUM7QUFDZCxhQUFLLEVBQUUsd0JBQXdCO0FBQy9CLFlBQUksRUFBRSxTQUFTO0FBQ2YseUJBQWlCLEVBQUUsSUFBSTtBQUN2Qix5QkFBaUIsRUFBRSxLQUFLO0FBQ3hCLGFBQUssRUFBRSxJQUFJO09BQ1osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFBO0dBQ0gsQ0FBQTs7Ozs7QUFNRCxNQUFJLENBQUMsTUFBTSxHQUFHLFVBQVMsV0FBVyxFQUFFLEtBQUssRUFBQztBQUN4QyxRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFdBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFlBQVUsRUFBRSxDQUFDLENBQUM7O0FBRTdELFdBQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBVTtBQUNuRCxnQkFBVSxDQUFDLElBQUksQ0FBQztBQUNkLGFBQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBSSxFQUFFLE1BQU07QUFDWix5QkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLHlCQUFpQixFQUFFLEtBQUs7QUFDeEIsYUFBSyxFQUFFLElBQUk7T0FDWixDQUFDLENBQUM7S0FDSixDQUFDLENBQUE7R0FDSCxDQUFBOzs7QUFHRCxRQUFNLENBQUMsS0FBSyxHQUFHLFlBQVc7QUFDdEIsVUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0dBQ3hCLENBQUM7QUFDRixRQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWpCLFFBQU0sQ0FBQyxLQUFLLEdBQUcsWUFBWTtBQUN6QixVQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztHQUNsQixDQUFDOztBQUVGLFFBQU0sQ0FBQyxJQUFJLEdBQUcsVUFBUyxNQUFNLEVBQUU7QUFDN0IsVUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3hCLFVBQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFekIsVUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDdEIsQ0FBQzs7QUFFRixRQUFNLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQzs7O0FBRy9CLFNBQU8sQ0FBQyxNQUFNLENBQUMsVUFBUyxJQUFJLEVBQUM7QUFDM0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDcEIsQ0FBQyxDQUFBOzs7QUFHRixNQUFJLE1BQU0sR0FBRyxDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSwwQkFBMEIsRUFBRyxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSwyQkFBMkIsRUFBRSxpQ0FBaUMsRUFBRSx3QkFBd0IsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxlQUFlLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDOXFCLE1BQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNoRSxNQUFJLENBQUMsR0FBRyxZQUFVLFNBQVMsQUFBRSxDQUFDOztBQUU5QixNQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLE1BQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBRTlCLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvYXNzZXRzL291dHNpZGUvb3V0c2lkZS5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAubW9kdWxlKCdjbGlwcGVkSW4nKVxuICAuY29udHJvbGxlcignT3V0c2lkZUN0cmwnLCBmdW5jdGlvbihPdXRzaWRlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24sIFByb2ZpbGUsICRyb3V0ZVBhcmFtcywgU3dlZXRBbGVydCwgJHNjb3BlLCAkYW5pbWF0ZSl7XG4vLz09PT09PT09PT09PT09PT09PUNPTlRST0xMRVIgRk9SIFRIRSBHRVQgT1VUU0lERSBQQUdFPT09PT09PT09PT09PT09PT09PT1cbiAgICB2YXIgbWFpbiA9IHRoaXM7XG4gICAgdmFyIHVzZXJJRCA9ICRyb290U2NvcGUuYXV0aC51aWQ7XG4gICAgbWFpbi50cmlwID0ge307XG4gICAgbWFpbi52aWV3SUQgPSAkcm91dGVQYXJhbXMuaWQ7XG5cbiAgICAvL2FyZSB5b3Ugdmlld2luZyB5b3VyIG93biB0cmlwIHBhZ2U/XG4gICAgbWFpbi5zZWxmID0gbWFpbi52aWV3SUQgPT09IHVzZXJJRCA/IHRydWUgOiBmYWxzZTtcblxuICAgIC8vYXR0YWNoIG5hbWUgYW5kIHBpYyB0byB0cmlwIG9ialxuICAgIFByb2ZpbGUuZ2V0UHJvZmlsZSh1c2VySUQsIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgbWFpbi50cmlwLnByb2ZQaWMgPSByZXNwb25zZS5waG90bztcbiAgICAgICAgbWFpbi50cmlwLm5hbWUgPSByZXNwb25zZS5uYW1lO1xuICAgICAgICBtYWluLnRyaXAubWVtYmVycyA9IFtdO1xuICAgICAgfSlcbiAgICAvL2NyZWF0ZSBhIHRyaXAuIG9uZSBwZXIgdXNlclxuICAgIG1haW4uY3JlYXRlVHJpcCA9IGZ1bmN0aW9uKCl7XG4gICAgICBPdXRzaWRlLmNyZWF0ZVRyaXAobWFpbi50cmlwLCB1c2VySUQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3V0c2lkZScpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9nZXQgbGlzdCBvZiB0cmlwc1xuICAgIE91dHNpZGUuZ2V0VHJpcHMoZnVuY3Rpb24oYWxsVHJpcHMpe1xuICAgICAgbWFpbi5hbGxUcmlwcyA9IGFsbFRyaXBzO1xuICAgICAgbWFpbi50aGlzVHJpcCA9IGFsbFRyaXBzW21haW4udmlld0lEXTtcblxuICAgICAgLy9nZXQgcHJvZmlsZXMgb2YgY3VycmVudCB0cmlwIG1lbWJlcnNcbiAgICAgIG1haW4udGhpc1RyaXAucHJvZmlsZXMgPSBbXTtcbiAgICAgIGZvcih2YXIgc2ltcGxlSUQgaW4gbWFpbi50aGlzVHJpcC5tZW1iZXJzKXtcbiAgICAgICAgaWYodXNlcklEPT09bWFpbi50aGlzVHJpcC5tZW1iZXJzW3NpbXBsZUlEXSl7XG4gICAgICAgICAgJCgnLnJlcXVlc3QtYnV0dG9uJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy91c2luZyBjbG9zdXJlIGFnYWluXG4gICAgICAgIChmdW5jdGlvbihwcm9maWxlSUQpe1xuICAgICAgICAgIFByb2ZpbGUuZ2V0UHJvZmlsZShwcm9maWxlSUQsIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgZGF0YS5zaW1wbGVMb2dpbiA9IHByb2ZpbGVJRDtcbiAgICAgICAgICAgIG1haW4udGhpc1RyaXAucHJvZmlsZXMucHVzaChkYXRhKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KShtYWluLnRoaXNUcmlwLm1lbWJlcnNbc2ltcGxlSURdKTtcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICAvL3JlcXVlc3QgdG8gYmUgYWRkZWQgdG8gdHJpcCBtZW1iZXJzXG4gICAgbWFpbi50cmlwUmVxdWVzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICBPdXRzaWRlLmFkZFRyaXBSZXF1ZXN0KG1haW4udmlld0lELCB1c2VySUQsIGZ1bmN0aW9uKGxpc3Qpe1xuICAgICAgICAkKCcucmVxdWVzdC1idXR0b24nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHtcbiAgICAgICAgICB0aXRsZTogJ1JlcXVlc3QgU2VudCEnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgdGltZXI6IDMwMDBcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIGdldCBsaXN0IG9mIHRyaXAgcmVxdWVzdHNcbiAgICBPdXRzaWRlLmdldFRyaXBSZXF1ZXN0cyhtYWluLnZpZXdJRCwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgbWFpbi5yZXF1ZXN0TGlzdCA9IHJlc3BvbnNlO1xuICAgICAgbWFpbi5uYW1lTGlzdCA9IFtdO1xuICAgICAgZm9yKHZhciBpZCBpbiBtYWluLnJlcXVlc3RMaXN0KXtcbiAgICAgICAgLy9kaXNhYmxlIGJ1dHRvbiBpZiB5b3UndmUgYWxyZWFkeSByZXF1ZXN0ZWQgb25jZVxuICAgICAgICBpZihpZD09PXVzZXJJRCl7XG4gICAgICAgICAgJCgnLnJlcXVlc3QtYnV0dG9uJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy9nZXQgdHJpcCBtZW1iZXIncyBuYW1lc1xuICAgICAgICAgIC8vZnVjayB5ZWEganVzdCBsZWFybmVkIGhvdyB0byB1c2UgY2xvc3VyZVxuICAgICAgICAoZnVuY3Rpb24ocHJvZmlsZUlEKXtcbiAgICAgICAgICBQcm9maWxlLmdldFByb2ZpbGUocHJvZmlsZUlELCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGRhdGEuc2ltcGxlTG9naW4gPSBwcm9maWxlSUQ7XG4gICAgICAgICAgICBtYWluLm5hbWVMaXN0LnB1c2goZGF0YSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSkoaWQpO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvL2FkZCB0byB0cmlwIG1lbWJlcnMgYW5kIG5vdGlmeSByZXF1ZXN0ZXJcbiAgICBtYWluLmFjY2VwdCA9IGZ1bmN0aW9uKHNpbXBsZUxvZ2luLCBpbmRleCl7XG4gICAgICBtYWluW2luZGV4XSA9IHRydWU7XG4gICAgICBPdXRzaWRlLmRlbGV0ZVRyaXBSZXF1ZXN0KHVzZXJJRCwgc2ltcGxlTG9naW4sIGZ1bmN0aW9uKCl7fSk7XG4gICAgICBPdXRzaWRlLmFkZFRyaXBNZW1iZXIodXNlcklELCBzaW1wbGVMb2dpbiwgZnVuY3Rpb24oKXt9KTtcbiAgICAgIC8vbm90aWZ5IHJlcXVlc3RlclxuICAgICAgT3V0c2lkZS5ub3RpZnkoc2ltcGxlTG9naW4sIHVzZXJJRCwgdHJ1ZSwgZnVuY3Rpb24oKXtcbiAgICAgICAgU3dlZXRBbGVydC5zd2FsKHtcbiAgICAgICAgICB0aXRsZTogJ0FkZGVkIHRvIHRyaXAgbWVtYmVycyEnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgdGltZXI6IDMwMDBcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vZGVsZXRlIHRyaXAgcmVxdWVzdCBhbmQgbm90aWZ5IHJlcXVlc3RlclxuICAgIC8vPT09PT09PT09PT09PT09cmVxdWVzdCBpcyBkeW5hbWljYWxseSBnZW5lcmF0ZWQgc28gdHJ5ICQoKS5vbihjbGljaywgJ3JlcXVlc3QnKVxuXG5cbiAgICBtYWluLnJlamVjdCA9IGZ1bmN0aW9uKHNpbXBsZUxvZ2luLCBpbmRleCl7XG4gICAgICBtYWluW2luZGV4XSA9IHRydWU7XG4gICAgICBPdXRzaWRlLmRlbGV0ZVRyaXBSZXF1ZXN0KHVzZXJJRCwgc2ltcGxlTG9naW4sIGZ1bmN0aW9uKCl7fSk7XG4gICAgICAvL25vdGlmeSByZXF1ZXN0ZXJcbiAgICAgIE91dHNpZGUubm90aWZ5KHNpbXBsZUxvZ2luLCB1c2VySUQsIGZhbHNlLCBmdW5jdGlvbigpe1xuICAgICAgICBTd2VldEFsZXJ0LnN3YWwoe1xuICAgICAgICAgIHRpdGxlOiAnUmVxdWVzdCBEZWxldGVkIScsXG4gICAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICB0aW1lcjogMzAwMFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy9pbml0aWFsaXplIGRhdGVwaWNrZXJcbiAgICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmR0ID0gbmV3IERhdGUoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUudG9kYXkoKTtcblxuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5kdCA9IG51bGw7XG4gICAgfTtcblxuICAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgJHNjb3BlLm9wZW5lZCA9IHRydWU7XG4gICAgfTtcblxuICAgICRzY29wZS5mb3JtYXQgPSAnZGQtTU1NTS15eXl5JztcblxuICAgIC8vZ2V0IElQIGxvY2F0aW9uIG9iamVjdFxuICAgIE91dHNpZGUuZ2V0R2VvKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgbWFpbi5nZW9PYmogPSBkYXRhO1xuICAgIH0pXG5cbiAgICAvL3JhbmRvbWl6ZSB0aGUgYmFja2dyb3VuZCBpbWFnZVxuICAgIHZhciBpbWdBcnIgPSBbJ0FiaXF1YSBGYWxscy5qcGVnJywgJ010LiBGdWppIC5qcGcnLCAnQmFuZmYgTmF0aW9uYWwgUGFyay5qcGVnJywgICdNdC4gRnVqaS5qcGVnJywgJ0JyeWNlIENhbnlvbiAuanBnJywgJ010LiBLaWxpbWFuamFyby5qcGVnJywgJ0JyeWNlIENhbnlvbi5qcGcnLCAnTXQuIFdoaXRuZXkuanBnJywgJ0NhbmFkaWFuIFJvY2tpZXMuanBlZycsICdOYXZhZ2lvIEJlYWNoLmpwZWcnLCAnQ3JhdGVyIExha2UuanBlZycsICdPYmVkIFJpdmVyLmpwZycsICdEb2xvbWl0ZXMuanBlZycsICdQYXRhZ29uaWEuanBnJywgJ0V2ZXJlc3QuanBlZycsICdSZWR3b29kIE5hdGlvbmFsIFBhcmsuanBnJywgJ0V2ZXJncmVlbiBNb3VudGFpbiBMb29rb3V0LmpwZWcnLCAnU2FuIEp1YW4gTW91bnRhaW5zLmpwZycsICdHcmFuZCBUZXRvbnMuanBlZycsICdTYXlyYW0gTGFrZS5qcGcnLCAnSGFsZiBEb21lLmpwZycsICdTbmFrZSBSaXZlci5qcGVnJywgJ0lzbGUgb2YgU2t5ZS5qcGVnJywgJ1N3aXNzIEFscHMuanBnJywgJ0phc3BlciBOYXRpb25hbCBQYXJrLmpwZWcnLCAnVGF1Z2xiYWNoLmpwZycsICdLYXVhaS5qcGcnLCAnVG9ybmdhdCBNb3VudGFpbnMuanBnJywgJ1lvc2VtaXRlIC5qcGcnLCAnTW9udW1lbnQgVmFsbGV5LmpwZycsICdZb3NlbWl0ZS5qcGVnJywgJ01vcmFpbmUgTGFrZS5qcGVnJ107XG4gICAgdmFyIHJhbmRvbVBpYyA9IGltZ0FycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqaW1nQXJyLmxlbmd0aCldO1xuICAgIG1haW4ucGljID0gYGltZy8ke3JhbmRvbVBpY31gO1xuICAgIC8vY2FwdGlvbiBmb3IgaW1hZ2VcbiAgICB2YXIgY2FwdGlvbkFyciA9IHJhbmRvbVBpYy5zcGxpdCgnLmpwJyk7XG4gICAgbWFpbi5waWNUZXh0ID0gY2FwdGlvbkFyclswXTtcblxuICB9KTtcbiJdfQ==

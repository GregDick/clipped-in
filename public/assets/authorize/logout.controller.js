'use strict';

angular.module('clippedIn').controller('LogoutCtrl', function (FB_URL, $scope, $rootScope, $location) {
  var fb = new Firebase(FB_URL);

  fb.unauth(function () {
    $rootScope.auth = null;
    $location.path('/login');
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc3NldHMvYXV0aG9yaXplL2xvZ291dC5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUNKLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FDbkIsVUFBVSxDQUFDLFlBQVksRUFBRSxVQUFTLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQztBQUN2RSxNQUFJLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUIsSUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZO0FBQ3BCLGNBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGFBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDMUIsQ0FBQyxDQUFDO0NBSUosQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9hc3NldHMvYXV0aG9yaXplL2xvZ291dC5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAubW9kdWxlKCdjbGlwcGVkSW4nKVxuICAuY29udHJvbGxlcignTG9nb3V0Q3RybCcsIGZ1bmN0aW9uKEZCX1VSTCwgJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24pe1xuICAgIHZhciBmYiA9IG5ldyBGaXJlYmFzZShGQl9VUkwpO1xuXG4gICAgZmIudW5hdXRoKGZ1bmN0aW9uICgpIHtcbiAgICAgICRyb290U2NvcGUuYXV0aCA9IG51bGw7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgfSk7XG5cblxuXG4gIH0pO1xuIl19

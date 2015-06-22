angular
  .module('clippedIn')
  .controller('ProfileCtrl', function(FB_URL, $rootScope, Profile){
    var main = this;

    Profile.getProfile($rootScope.auth.uid, function(profileObj){
      main.profileObj = profileObj;
    });
  })

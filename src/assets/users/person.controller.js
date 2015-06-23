angular
  .module('clippedIn')
  .controller('PersonCtrl', function(Profile, $routeParams, FB_URL){
    var main = this;

    main.id = $routeParams.id;

    Profile.getProfile(main.id, function(data){
      main.profileObj = data;
    })
  })

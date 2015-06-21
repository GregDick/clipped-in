angular
  .module('clippedIn')
  .controller('AuthCtrl', function(FB_URL){
    var main = this;
    var fb = new Firebase(FB_URL);

    main.login = function(email, password){
      fb.authWithPassword({}, function(){})

    }

  })

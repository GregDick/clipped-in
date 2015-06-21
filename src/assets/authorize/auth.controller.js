angular
  .module('clippedIn')
  .controller('AuthCtrl', function(FB_URL, $rootScope, $scope, $location, Profile){
    var main = this;
    var fb = new Firebase(FB_URL);

    main.login = function(email, password){
      fb.authWithPassword({
        email: email,
        password: password
      }, function(err, authData){
        if(err){
          console.log(err);
        }else{
          $rootScope.auth = authData;
          $('#modal').modal('hide');
          $location.path('/profile');
          $scope.$apply();
        }
      })
    }

    main.modalLoad = function(){
      $('#modal').modal('show');
      $('#modal').on('hidden.bs.modal', function (e) {
        $location.path('/login');
        $scope.$apply();
      });
    }

    main.register = function(){
      fb.createUser({
        email: main.person.email,
        password: main.person.password
      }, function(err, userData){
        if(err){
          console.log(err);
        }else{
          Profile.create(main.person, userData.uid, function(res){
            main.login(res.email, res.password);
          });
        }
      })
    }




  })

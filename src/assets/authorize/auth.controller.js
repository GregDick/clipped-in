angular
  .module('clippedIn')
  .controller('AuthCtrl', function(FB_URL, $rootScope, $scope, $location, Profile, SweetAlert){
    var main = this;
    var fb = new Firebase(FB_URL);
    main.resetSuccess = false;
    main.changeSuccess = false;

    main.login = function(email, password){
      fb.authWithPassword({
        email: email,
        password: password
      }, function(err, authData){
        if(err){
          SweetAlert.swal({
            title: 'Login Failed',
            type: 'error',
            text: err,
            allowOutsideClick: true,
            showConfirmButton: false,
            timer: 3000
          })
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
        email: main.secret.email,
        password: main.secret.password
      }, function(err, userData){
        if(err){
          console.log(err);
        }else{
          Profile.create(main.person, userData.uid, function(){
            main.login(main.secret.email, main.secret.password);
          });
        }
      })
    }

    main.resetPass = function () {
      fb.resetPassword({
        email: main.reset.email
      }, function(err){
        if(err){
          alert('Error: '+ err);
        }else{
          main.resetSuccess = true;
          $scope.$apply();
        }
      })
    }

    main.changePass = function(){
      fb.changePassword({
        email: main.temp.email,
        oldPassword: main.temp.oldPass,
        newPassword: main.temp.newPass
      }, function(error){
        if(error){
          alert('Error: '+error);
        }else{
          main.changeSuccess = true;
          $rootScope.auth.password.isTemporaryPassword = false;
          $scope.$apply();
        }
      })
    }

  });

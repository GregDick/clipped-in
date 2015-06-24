angular
  .module('clippedIn')
  .controller('OutsideCtrl', function($scope, uiGmapGoogleMapApi, Outside){
    var main = this;

    $scope.markers = []

    Outside.getGeo(function(data){
      main.geoObj = data;
    })

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = {
        center: {
          latitude: 51.219053,
          longitude: 4.404418
        },
        zoom: 14
      };
      $scope.options = {
        scrollwheel: false
      };
    });
  })

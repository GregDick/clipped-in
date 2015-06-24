angular
  .module('clippedIn')
  .controller('OutsideCtrl', function(Outside){
    var main = this;

    Outside.getGeo(function(data){
      console.log(data);
      main.geoObj = data;
    })

  })

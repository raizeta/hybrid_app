myAppModule.factory('LocationService', function ($q) {

  var GetGpsLocation = function (options) 
  {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function (result) 
      {
          var currentLocation = {};
          currentLocation.latitude    = result.coords.latitude;
          currentLocation.longitude   = result.coords.longitude;
          currentLocation.statusgps   = "Bekerja";
          deferred.resolve(currentLocation);
      },
      function(err)
      {
    	   var currentLocation = {};
         if(err)
         {
        	   if(err.code == 1 || err.code == "1")
              {
                currentLocation.latitude    = 0;
                currentLocation.longitude   = 0;
                currentLocation.statusgps   = "EC:1";
                deferred.resolve(currentLocation);
              }
              else if(err.code == 2 || err.code == "2")
              {
                currentLocation.latitude    = 0;
                currentLocation.longitude   = 0;
                currentLocation.statusgps   = "EC:2";
                deferred.resolve(currentLocation);
              }
              else if(err.code == 3 || err.code == "3")
              {
                currentLocation.latitude    = 0;
                currentLocation.longitude   = 0;
                currentLocation.statusgps   = "EC:3";
                deferred.resolve(currentLocation);
              }
          }
          else
          {
            deferred.rejected(err);
          }
          
      },options);
      
      return deferred.promise
  }

  var WatchGpsLocation = function () 
  {
      var currentLocation = {};
      var options = {timeout: 10000, enableHighAccuracy: false};
      
      var d = $q.defer();
      navigator.geolocation.watchPosition(
      function (options) 
      {
          currentLocation.latitude = options.coords.latitude;
          currentLocation.longitude = options.coords.longitude;
          d.resolve(currentLocation);
      },
      function(err)
      {
        alert("GPS Tidak Hidup");
      });
      
      return d.promise
  }


  return {
            GetGpsLocation:GetGpsLocation,
            WatchGpsLocation:WatchGpsLocation
        }

});
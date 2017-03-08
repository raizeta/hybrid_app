'use strict';
myAppModule.factory('GambarService', ["$rootScope","$http","$q","$filter","$window","LocationService",
function($rootScope,$http, $q, $filter, $window,LocationService)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

    var setGambarAction = function(ID_DETAIL,detail)
    {
        var url = getUrl();
        var deferred = $q.defer();
        
        $http.get(url + "/gambars/search?ID_DETAIL="+ ID_DETAIL)
        .success(function(response,status, headers, config) 
        {
            if(angular.isDefined(response.statusCode))
            {
                if (response.statusCode == 404)
                {
                    var result              = $rootScope.seriliazeobject(detail);
                    var serialized          = result.serialized;
                    var config              = result.config;

                    $http.post(url + "/gambars",serialized,config)
                    .success(function(response,status, headers, config) 
                    {
                        deferred.resolve(response);
                    });
                }
            }
            else
            {
                deferred.resolve(response.Gambar[0]);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    var setEndGambarAction = function(ID_DETAIL,gambarkunjungan)
    {
        var url = getUrl();
        var deferred = $q.defer();
        $http.get(url + "/gambars/search?ID_DETAIL="+ ID_DETAIL)
        .success(function(data,status, headers, config) 
        {
            var idgambar = data.Gambar[0].ID;
            var result              = $rootScope.seriliazeobject(gambarkunjungan);
            var serialized          = result.serialized;
            var config              = result.config;

            $http.put(url + "/gambars/" + idgambar,serialized,config)
            .success(function(data,status, headers, config) 
            {
                deferred.resolve(data);
            });
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }
    var updateGambarStatus = function(ID_DETAIL,statuskunjungan)
    {
        var url = getUrl();
        var deferred = $q.defer();
        $http.get(url + "/statuskunjungans/search?ID_DETAIL=" + ID_DETAIL)
        .success(function(data,status, headers, config) 
        {
            var idstatuskunjungan = data.StatusKunjungan[0].ID;

            var resultstatus            = $rootScope.seriliazeobject(statuskunjungan);
            var serialized              = resultstatus.serialized;
            var config                  = resultstatus.config;
            
            $http.put(url + "/statuskunjungans/"+ idstatuskunjungan,serialized,config)
            .success(function(data,status, headers, config) 
            {
                deferred.resolve(data);
            }); 
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;

    }
	return{
            setGambarAction:setGambarAction,
            updateGambarStatus:updateGambarStatus,
            setEndGambarAction:setEndGambarAction
		}
}]);
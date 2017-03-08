'use strict';
myAppModule.factory('InventoryService', ["$rootScope","$http","$q","$filter","$window","LocationService",
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

    var setInventoryAction = function(detail)
    {
        var url = getUrl();
        var deferred = $q.defer();
        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url + "/productinventories",serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            if (status === 404)
            {
                deferred.resolve([]);
            }
            else    
            {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
    var updateInventoryStatus = function(ID_DETAIL,statuskunjungan)
    {
        var url = getUrl();
        var deferred = $q.defer();
        $http.get(url + "/statuskunjungans/search?ID_DETAIL=" + ID_DETAIL)
        .success(function(data,status, headers, config) 
        {
            console.log(data);
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
            setInventoryAction:setInventoryAction,
            updateInventoryStatus:updateInventoryStatus
		}
}]);
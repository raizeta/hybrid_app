'use strict';
myAppModule.factory('ExpiredService', ["$rootScope","$http","$q","$filter","$window","LocationService",
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

    var setExpiredAction = function(ID_DETAIL)
    {
        var url = getUrl();
        var deferred = $q.defer();

        $http.get(url + "/expiredproducts/search?ID_DETAIL=" + ID_DETAIL)
        .success(function(data,status,headers,config) 
        {
            var expired = data.ExpiredProduct;
            var result = [];
            angular.forEach(expired, function(value, key)
            {
                var KD_BARANG = value.BRG_ID;
                result.push(KD_BARANG);
            });
            var x = $rootScope.unique(result);
            deferred.resolve(x);
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
            setExpiredAction:setExpiredAction,
            updateInventoryStatus:updateInventoryStatus
		}
}]);
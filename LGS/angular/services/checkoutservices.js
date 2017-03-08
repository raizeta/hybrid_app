'use strict';
myAppModule.factory('CheckOutService', ["$rootScope","$http","$q","$filter","$window","LocationService",
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
    var setCheckoutAction = function(ID_DETAIL,detail)
    {
        var url = getUrl();
        var deferred = $q.defer();
        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url + "/detailkunjungans/" + ID_DETAIL,serialized,config)
        .success(function(data,status, headers, config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            if (status === 404)
            {

            }
            else    
            {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    }
    var updateCheckoutStatus = function(idstatuskunjungan,statuskunjungan)
    {
        var url = getUrl();
        var deferred = $q.defer();

        var resultstatus            = $rootScope.seriliazeobject(statuskunjungan);
        var serialized              = resultstatus.serialized;
        var config                  = resultstatus.config;

        $http.put(url + "/statuskunjungans/"+ idstatuskunjungan,serialized,config)
        .success(function(data,status, headers, config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
	return{
            setCheckoutAction:setCheckoutAction,
            updateCheckoutStatus:updateCheckoutStatus
		}
}]);
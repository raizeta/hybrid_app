'use strict';
myAppModule.factory('GagalActionService', ["$rootScope","$http","$q","$filter","$window","LocationService",
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

    var setGagalGambar = function(detail)
    {
        var url = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url + "/gagalgambars",serialized,config)
        .success(function(response,status, headers, config) 
        {
            deferred.resolve(response);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }
    var setGagalCheck = function(detail)
    {
        var url = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url + "/gagalchecks",serialized,config)
        .success(function(response,status, headers, config) 
        {
            deferred.resolve(response);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }

	return{
            setGagalGambar:setGagalGambar,
            setGagalCheck:setGagalCheck
		}
}]);
'use strict';
myAppModule.factory('ManagerService', ["$rootScope","$http","$q","$window",
function($rootScope,$http, $q, $window)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
	

	var getManagerMemo = function()
	{
		var config = 
        {
            headers : 
            {
                // 'Accept': 'application/json',
                // 'Pragma': 'no-cache',
                // 'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'
                
            }
        };
		var url = getUrl();
		var deferred = $q.defer();
		var url = url + "/salesmanmemos";
		var method ="GET";
		$http({method:method, url:url,config:config,cache:false})
		.success(function(response) 
		{
			if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else if(angular.isDefined(response.Salesmanmemo))
            {
                deferred.resolve(response.Salesmanmemo); 
            }
		})
		.error(function(err,status)
        {
        	deferred.reject(err);
        });
		return deferred.promise;
	}
	var setManagerMemo = function(detail)
	{
		var url = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url + "/salesmanmemos",serialized,config)
        .success(function(response,status,headers,config) 
        {
            if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else
            {
                deferred.resolve(response); 
            }
        })
        .error(function(err)
        {
            deferred.reject(err);
        });

        return deferred.promise;
	}

	return{
			getManagerMemo:getManagerMemo,
			setManagerMemo:setManagerMemo
		}
}]);
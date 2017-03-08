'use strict';
myAppModule.factory('configurationService', ["$http","$q","$window","$cordovaSQLite",
function($http, $q, $window,$cordovaSQLite)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

	var getConfigRadius = function()
	{ 
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/configurations/search?statusaktif=1";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
    		if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else if(angular.isDefined(response.Configuration))
            {
                deferred.resolve(response.Configuration); 
            }
        })
        .error(function(err,status)
        {
        	deferred.reject(err);
        });	

        return deferred.promise;
	}

	return{
			getConfigRadius:getConfigRadius
		}
}]);